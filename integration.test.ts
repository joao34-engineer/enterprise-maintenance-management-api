import app from "./src/server";
import request from "supertest";

/**
 * GridOps Integration Tests
 * Tests the complete workflow: User → Asset → MaintenanceRecord → ChecklistTask
 */

describe("GridOps API Integration Tests", () => {

  // Test user creation and authentication
  describe("POST /user", () => {
    it("should create a new user and return a token", async () => {
      const res = await request(app)
        .post("/user")
        .send({ username: `engineer_${Date.now()}`, password: "securepass123" })
        .set("Accept", "application/json");

      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toEqual(200);
      expect(res.body.token).toBeTruthy();
    });
  });

  describe("POST /signin", () => {
    it("should authenticate existing user", async () => {
      // First create a user
      const username = `testuser_${Date.now()}`;
      await request(app)
        .post("/user")
        .send({ username, password: "testpass" });

      // Then sign in
      const res = await request(app)
        .post("/signin")
        .send({ username, password: "testpass" })
        .set("Accept", "application/json");

      expect(res.status).toEqual(200);
      expect(res.body.token).toBeTruthy();
    });
  });

  // Test authorization
  describe("Authorization Tests", () => {
    it("should reject requests without auth token", async () => {
      const res = await request(app).get("/api/asset");
      expect(res.status).toEqual(401);
    });

    it("should reject requests with invalid token", async () => {
      const res = await request(app)
        .get("/api/asset")
        .set("Authorization", "Bearer invalid-token");
      
      expect(res.status).toEqual(401);
    });
  });

  // Test full workflow - All steps in one test to maintain state
  describe("Complete Asset Lifecycle Workflow", () => {
    it("should complete full asset management workflow", async () => {
      // 1. Create user and get token
      const userRes = await request(app)
        .post("/user")
        .send({ username: `workflow_${Date.now()}`, password: "pass123" });
      
      expect(userRes.status).toBe(200);
      expect(userRes.body.token).toBeTruthy();
      const token = userRes.body.token;

      // 2. Create asset
      const assetRes = await request(app)
        .post("/api/asset")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Generator-X-500" });
      
      expect(assetRes.status).toBe(200);
      expect(assetRes.body.data).toBeTruthy();
      expect(assetRes.body.data.name).toBe("Generator-X-500");
      const assetId = assetRes.body.data.id;

      // 3. List assets
      const assetsListRes = await request(app)
        .get("/api/asset")
        .set("Authorization", `Bearer ${token}`);
      
      expect(assetsListRes.status).toBe(200);
      expect(assetsListRes.body.data).toBeInstanceOf(Array);
      expect(assetsListRes.body.data.length).toBeGreaterThan(0);

      // 4. Get single asset
      const singleAssetRes = await request(app)
        .get(`/api/asset/${assetId}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(singleAssetRes.status).toBe(200);
      expect(singleAssetRes.body.data.id).toBe(assetId);

      // 5. Update asset
      const updateAssetRes = await request(app)
        .put(`/api/asset/${assetId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Generator-X-500-Updated" });
      
      expect(updateAssetRes.status).toBe(200);
      expect(updateAssetRes.body.data.name).toBe("Generator-X-500-Updated");

      // 6. Create maintenance record
      const maintenanceRes = await request(app)
        .post("/api/maintenance")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Emergency Repair",
          body: "Coolant leak detected and fixed",
          assetId: assetId
        });
      
      expect(maintenanceRes.status).toBe(200);
      expect(maintenanceRes.body.data).toBeTruthy();
      expect(maintenanceRes.body.data.title).toBe("Emergency Repair");
      const recordId = maintenanceRes.body.data.id;

      // 7. List maintenance records
      const recordsListRes = await request(app)
        .get("/api/maintenance")
        .set("Authorization", `Bearer ${token}`);
      
      expect(recordsListRes.status).toBe(200);
      expect(recordsListRes.body.data).toBeInstanceOf(Array);

      // 8. Get single maintenance record
      const singleRecordRes = await request(app)
        .get(`/api/maintenance/${recordId}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(singleRecordRes.status).toBe(200);
      expect(singleRecordRes.body.data.id).toBe(recordId);

      // 9. Add checklist task 1
      const task1Res = await request(app)
        .post("/api/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Coolant System Inspection",
          description: "Leak found in pump seal",
          maintenanceRecordId: recordId
        });
      
      expect(task1Res.status).toBe(200);
      expect(task1Res.body.data.name).toBe("Coolant System Inspection");
      const task1Id = task1Res.body.data.id;

      // 10. Add checklist task 2
      const task2Res = await request(app)
        .post("/api/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Seal Replacement",
          description: "New seal installed and tested",
          maintenanceRecordId: recordId
        });
      
      expect(task2Res.status).toBe(200);

      // 11. List all tasks
      const tasksListRes = await request(app)
        .get("/api/task")
        .set("Authorization", `Bearer ${token}`);
      
      expect(tasksListRes.status).toBe(200);
      expect(tasksListRes.body.data).toBeInstanceOf(Array);
      expect(tasksListRes.body.data.length).toBeGreaterThanOrEqual(2);

      // 12. Get single task
      const singleTaskRes = await request(app)
        .get(`/api/task/${task1Id}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(singleTaskRes.status).toBe(200);
      expect(singleTaskRes.body.data.id).toBe(task1Id);

      // 13. Update task
      const updateTaskRes = await request(app)
        .put(`/api/task/${task1Id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Leak found in pump seal - Seal replaced" });
      
      expect(updateTaskRes.status).toBe(200);
      expect(updateTaskRes.body.data.description).toContain("Seal replaced");

      // 14. Update maintenance status to COMPLETED
      const updateStatusRes = await request(app)
        .put(`/api/maintenance/${recordId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "COMPLETED" });
      
      expect(updateStatusRes.status).toBe(200);
      expect(updateStatusRes.body.data.status).toBe("COMPLETED");

      // 15. Delete task
      const deleteTaskRes = await request(app)
        .delete(`/api/task/${task1Id}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(deleteTaskRes.status).toBe(200);

      // 16. Delete maintenance record
      const deleteRecordRes = await request(app)
        .delete(`/api/maintenance/${recordId}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(deleteRecordRes.status).toBe(200);

      // 17. Delete asset
      const deleteAssetRes = await request(app)
        .delete(`/api/asset/${assetId}`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(deleteAssetRes.status).toBe(200);
    });
  });
});