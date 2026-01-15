import app from '../server'
import supertest from 'supertest'

/**
 * GridOps API Routes Tests
 * Basic smoke tests for API endpoints
 */

describe('GridOps API Routes', () => {
    
    describe('GET /', () => {
        it('should redirect to Swagger docs', async () => {
            const res = await supertest(app).get('/')
            expect(res.status).toBe(302)
            expect(res.headers.location).toBe('/docs')
        })
    })

    describe('Authentication Routes', () => {
        it('POST /user - should accept user creation requests', async () => {
            const res = await supertest(app)
                .post('/user')
                .send({ username: `test_${Date.now()}`, password: 'password123' })

            // Log response for debugging
            if (res.status !== 200) {
                console.log('User creation failed:', res.status, res.body)
            }

            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })

        it('POST /signin - should accept signin requests', async () => {
            // Create user first
            const username = `signin_test_${Date.now()}`
            await supertest(app)
                .post('/user')
                .send({ username, password: 'testpass' })

            // Then sign in
            const res = await supertest(app)
                .post('/signin')
                .send({ username, password: 'testpass' })

            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })
    })

    describe('Protected Routes - No Auth', () => {
        it('GET /api/asset - should reject without token', async () => {
            const res = await supertest(app).get('/api/asset')
            expect(res.status).toBe(401)
        })

        it('GET /api/maintenance - should reject without token', async () => {
            const res = await supertest(app).get('/api/maintenance')
            expect(res.status).toBe(401)
        })

        it('GET /api/task - should reject without token', async () => {
            const res = await supertest(app).get('/api/task')
            expect(res.status).toBe(401)
        })
    })

    describe('End-to-End Workflow', () => {
        let taskId: string;
        let token: string;
        let assetId: string;
        let maintenanceId: string;

        beforeAll(async () => {
            // Register and login user
            const username = `workflow_${Date.now()}`;
            await supertest(app)
                .post('/user')
                .send({ username, password: 'workflowpass' });
            const res = await supertest(app)
                .post('/signin')
                .send({ username, password: 'workflowpass' });
            token = res.body.token;
        });

        it('should create an asset', async () => {
            const res = await supertest(app)
                .post('/api/asset')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Workflow Motor',
                });
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBeTruthy();
            assetId = res.body.data.id;
        });

        it('should create a maintenance record for the asset', async () => {
            const res = await supertest(app)
                .post('/api/maintenance')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Workflow Maintenance',
                    body: 'Testing maintenance creation',
                    assetId,
                    status: 'SCHEDULED',
                    version: '1.0',
                });
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBeTruthy();
            maintenanceId = res.body.data.id;
        });

        it('should create a checklist task for the maintenance record', async () => {
            const res = await supertest(app)
                .post('/api/task')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Workflow Task',
                    description: 'Checklist for workflow',
                    maintenanceRecordId: maintenanceId,
                });
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBeTruthy();
            taskId = res.body.data.id;
        });

        it('should update the asset', async () => {
            const res = await supertest(app)
                .put(`/api/asset/${assetId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Workflow Motor Updated' });
            expect(res.status).toBe(200);
        });

        it('should update the maintenance record', async () => {
            const res = await supertest(app)
                .put(`/api/maintenance/${maintenanceId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Workflow Maintenance Updated' });
            expect(res.status).toBe(200);
        });

        it('should update the checklist task', async () => {
            const res = await supertest(app)
                .put(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Workflow Task Updated' });
            expect(res.status).toBe(200);
        });

        it('should delete the checklist task', async () => {
            const res = await supertest(app)
                .delete(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should delete the maintenance record', async () => {
            const res = await supertest(app)
                .delete(`/api/maintenance/${maintenanceId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should delete the asset', async () => {
            const res = await supertest(app)
                .delete(`/api/asset/${assetId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    })
})