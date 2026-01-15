# 🔧 GridOps Transformation Guide: Structured Prompts & Implementation Steps

> **Purpose**: Transform the API-v4 changelog system into GridOps, an enterprise-grade Industrial Asset Lifecycle Management API.
>
> **Audience**: TypeScript/Node.js developers & AI assistants
>
> **Tech Stack**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Swagger UI

---

## 📊 Transformation Overview

### Current State (API-v4)

- **Domain**: Generic product changelog tracker
- **Models**: User → Product → Update → UpdatePoint
- **Use Case**: Software release notes and version tracking

### Target State (GridOps)

- **Domain**: Industrial electrical asset maintenance
- **Models**: User → Asset → MaintenanceRecord → ChecklistTask
- **Use Case**: Field engineer maintenance logging for heavy machinery

---

## 🎯 Phase 1: Database & Schema Rebrand

### ✅ **STEP 1.1: Prisma Schema Transformation** - COMPLETED

**Objective**: Refactor the Prisma database schema to reflect industrial asset management terminology.

**Current Schema Analysis**:

```typescript
// Current Models
- Product (generic product tracking)
- Update (changelog entries)
- UpdatePoint (granular change items)
- Status: IN_PROGRESS, SHIPPED, DEPRECATED
```

**Target Schema Requirements**:

```typescript
// Target Models
- Asset (physical equipment: generators, transformers, panels)
- MaintenanceRecord (service events and inspections)
- ChecklistTask (granular maintenance checklist items)
- Status: SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR
```

#### 📋 **PROMPT 1.1: Schema Refactoring**

```
Context: I have a Prisma schema for a generic changelog API (API-v4) that tracks Products, Updates, and UpdatePoints. I need to rebrand this into an Industrial Asset Management system called 'GridOps'.

Task: Refactor the Prisma schema located at `prisma/schema.prisma` with the following transformations:

1. MODEL RENAMING:
   - Rename `Product` model to `Asset`
   - Rename `Update` model to `MaintenanceRecord`
   - Rename `UpdatePoint` model to `ChecklistTask`

2. FIELD UPDATES:
   - In Asset model: Rename `belongsToid` to `belongsToId` (fix typo)
   - In MaintenanceRecord model:
     * Change field name from `updateAt` to `updatedAt` (consistency)
     * Update `status` enum from (IN_PROGRESS, SHIPPED, DEPRECATED) to (SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR)
   - In ChecklistTask model: Change `updateAt` to `updatedAt`

3. RELATIONSHIP PRESERVATION:
   - Maintain: User → Asset (one-to-many)
   - Maintain: Asset → MaintenanceRecord (one-to-many)
   - Maintain: MaintenanceRecord → ChecklistTask (one-to-many)

4. SEMANTIC UPDATES:
   - In MaintenanceRecord: `title` represents "Service Type" (e.g., "Annual Safety Inspection")
   - In MaintenanceRecord: `body` represents "Technician Notes"
   - In MaintenanceRecord: `version` represents "Firmware Version (if applicable)"
   - In ChecklistTask: `name` represents "Task Name" (e.g., "Voltage Output Checked")
   - In ChecklistTask: `description` represents "Result" (e.g., "Output stable at 240V")

Requirements:
- Keep all field types unchanged (String, DateTime, UUID, etc.)
- Preserve all indexes and constraints
- Maintain strict TypeScript compatibility
- Add comments to document the domain change

Output: Complete refactored schema.prisma file
```

**Expected Outcome**:

- Updated `prisma/schema.prisma` with new model names
- Enum values reflect maintenance workflow
- Field names follow consistent TypeScript conventions

**Validation Checklist**:

- [ ] Schema compiles without errors
- [ ] All relations are preserved
- [ ] Status enum reflects maintenance states
- [ ] Field names are consistent (updatedAt, belongsToId)

---

### ✅ **STEP 1.2: Database Migration** - COMPLETED

**Objective**: Generate and apply Prisma migration to update database tables.

#### 📋 **PROMPT 1.2: Generate Migration**

```
Context: I have just refactored my Prisma schema from a changelog system to an industrial asset management system (GridOps). The schema.prisma file has been updated with new model names.

Task: Generate a Prisma migration to safely rename database tables and update enum values.

Requirements:
1. Create a migration named "rebrand_to_gridops"
2. The migration should:
   - Rename table `Product` to `Asset`
   - Rename table `Update` to `MaintenanceRecord`
   - Rename table `UpdatePoint` to `ChecklistTask`
   - Update the Status enum values
   - Fix column name typos (belongsToid → belongsToId, updateAt → updatedAt)
3. Preserve ALL existing data
4. Update foreign key constraints automatically

Execute: `npx prisma migrate dev --name rebrand_to_gridops`

After migration:
- Verify the migration file in `prisma/migrations/`
- Confirm the database schema matches the new Prisma schema
- Check that Prisma Client is regenerated with new types
```

**Expected Outcome**:

- New migration file created
- Database tables renamed
- Prisma Client regenerated with Asset, MaintenanceRecord, ChecklistTask types

**Validation Commands**:

```bash
npx prisma studio  # Visual check of renamed tables
npx prisma db pull # Verify schema matches database
```

---

## 🔄 Phase 2: TypeScript Code Refactoring

### ✅ **STEP 2.1: Handler Files Transformation** - COMPLETED

**Objective**: Refactor Express route handlers to use new model terminology.

**Files to Modify**:

- `src/handlers/product.ts` → `src/handlers/asset.ts`
- `src/handlers/update.ts` → `src/handlers/maintenance.ts`
- Create new: `src/handlers/task.ts` (for ChecklistTask)

#### 📋 **PROMPT 2.1: Refactor Product Handler**

```
Context: I am refactoring a TypeScript Express handler from a changelog API to an industrial asset management API. The Prisma schema has been updated with new model names (Product → Asset).

Task: Refactor the file `src/handlers/product.ts` to `src/handlers/asset.ts` with the following changes:

1. FILE OPERATIONS:
   - Create new file: `src/handlers/asset.ts` (copy content from product.ts)
   - Keep product.ts for now (we'll delete after testing)

2. FUNCTION RENAMING:
   - `getProducts` → `getAssets`
   - `getOneProduct` → `getOneAsset`
   - `createProduct` → `createAsset`
   - `updateProduct` → `updateAsset`
   - `deleteProduct` → `deleteAsset`

3. VARIABLE RENAMING (throughout all functions):
   - `product` → `asset`
   - `products` → `assets`
   - `req.body.name` stays the same (represents equipment ID)

4. PRISMA CLIENT UPDATES:
   - Replace all `prisma.product.*` with `prisma.asset.*`
   - Update `.findMany()`, `.findUnique()`, `.create()`, `.update()`, `.delete()` calls
   - Ensure `belongsToId` is used (not belongsToid)

5. TYPE ANNOTATIONS:
   - Update imports if using Prisma-generated types
   - Ensure strict TypeScript compliance

6. RESPONSE STRUCTURE:
   - Keep response format: `res.json({ data: asset })` or `res.json({ data: assets })`
   - Maintain error handling patterns

7. VALIDATION:
   - Update express-validator chains if needed
   - Ensure field validation matches Asset model

Requirements:
- Preserve all business logic (user-scoped queries, error handling)
- Maintain existing Express middleware compatibility
- Keep validation rules intact
- Ensure all async/await patterns are correct

Output: Complete `src/handlers/asset.ts` file with all functions refactored
```

**Expected Outcome**:

- New `asset.ts` handler with updated function names
- All Prisma queries use `prisma.asset.*`
- TypeScript types compile correctly

**Validation Checklist**:

- [ ] No TypeScript compilation errors
- [ ] All functions export correctly
- [ ] Prisma queries reference Asset model
- [ ] Variable names are semantically correct

---

#### 📋 **PROMPT 2.2: Refactor Update Handler**

```
Context: I am refactoring the Update handler to MaintenanceRecord handler for the GridOps industrial asset management API.

Task: Refactor `src/handlers/update.ts` to `src/handlers/maintenance.ts`:

1. FILE OPERATIONS:
   - Create `src/handlers/maintenance.ts` from update.ts

2. FUNCTION RENAMING:
   - `getUpdates` → `getMaintenanceRecords`
   - `getOneUpdate` → `getOneMaintenanceRecord`
   - `createUpdate` → `createMaintenanceRecord`
   - `updateUpdate` → `updateMaintenanceRecord`
   - `deleteUpdate` → `deleteMaintenanceRecord`

3. VARIABLE RENAMING:
   - `update` → `maintenanceRecord` or `record`
   - `updates` → `maintenanceRecords` or `records`
   - `updateId` → `recordId`

4. PRISMA CLIENT UPDATES:
   - Replace `prisma.update.*` with `prisma.maintenanceRecord.*`
   - Update queries to reference `Asset` instead of `Product` in includes
   - Example: `.include({ asset: true })` instead of `.include({ product: true })`

5. STATUS ENUM VALIDATION:
   - Update express-validator to accept: SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR
   - Remove old values: SHIPPED, DEPRECATED

6. FIELD UPDATES:
   - Ensure `productId` is renamed to `assetId` in create/update operations
   - Use `updatedAt` instead of `updateAt`

7. SEMANTIC CONTEXT:
   - Add comments explaining:
     * `title` = Service Type (e.g., "Annual Inspection")
     * `body` = Technician Notes
     * `version` = Firmware Version

Requirements:
- Ensure user authorization still checks asset ownership
- Maintain cascading queries (asset → user validation)
- Preserve error handling middleware integration

Output: Complete `src/handlers/maintenance.ts` file
```

**Expected Outcome**:

- `maintenance.ts` handler with maintenance workflow terminology
- Status validation updated to new enum values
- Proper asset relationship handling

---

#### 📋 **PROMPT 2.3: Create ChecklistTask Handler**

````
Context: The GridOps API needs a new handler for managing ChecklistTask items (formerly UpdatePoint). These represent granular maintenance checklist items completed during a service record.

Task: Create `src/handlers/task.ts` to handle ChecklistTask CRUD operations:

1. CREATE HANDLER FUNCTIONS:
   - `getChecklistTasks` - List all tasks for a maintenance record
   - `getOneChecklistTask` - Get single task by ID
   - `createChecklistTask` - Create new task (requires maintenanceRecordId)
   - `updateChecklistTask` - Update task name/description
   - `deleteChecklistTask` - Remove task

2. AUTHORIZATION PATTERN:
   - Verify task belongs to maintenance record belongs to asset belongs to current user
   - Example cascade check:
     ```typescript
     const task = await prisma.checklistTask.findUnique({
       where: { id: req.params.id },
       include: {
         maintenanceRecord: {
           include: { asset: true }
         }
       }
     })
     if (task.maintenanceRecord.asset.belongsToId !== req.user.id) {
       return res.status(401).json({ message: 'Unauthorized' })
     }
     ```

3. VALIDATION REQUIREMENTS:
   - name: required, string, max 255 chars
   - description: required, string
   - maintenanceRecordId: required on create (UUID format)

4. RESPONSE FORMAT:
   - Success: `res.json({ data: task })`
   - Error: Standard error response pattern

5. EXPORT PATTERN:
   - Export all functions individually for router consumption

Requirements:
- Follow existing handler patterns from asset.ts and maintenance.ts
- Use TypeScript strict mode
- Include proper error handling
- Add JSDoc comments for each function

Output: Complete `src/handlers/task.ts` file
````

**Expected Outcome**:

- New handler for ChecklistTask management
- Proper authorization chain validation
- Consistent error handling

---

### ✅ **STEP 2.2: Router Updates** - COMPLETED

**Objective**: Update route definitions to use new endpoints and handlers.

#### 📋 **PROMPT 2.4: Refactor Router**

```
Context: I have refactored all handler files (asset.ts, maintenance.ts, task.ts) for the GridOps API. Now I need to update the Express router to use the new endpoints and handler functions.

Task: Refactor `src/router.ts` to define new routes:

1. IMPORT UPDATES:
   - Import from `./handlers/asset` (instead of product)
   - Import from `./handlers/maintenance` (instead of update)
   - Import from `./handlers/task` (new)

2. ROUTE DEFINITIONS:

   **Asset Routes** (replace /product with /asset):
   - GET    /api/asset      → getAssets
   - GET    /api/asset/:id  → getOneAsset
   - POST   /api/asset      → createAsset (with validation)
   - PUT    /api/asset/:id  → updateAsset (with validation)
   - DELETE /api/asset/:id  → deleteAsset

   **Maintenance Routes** (replace /update with /maintenance):
   - GET    /api/maintenance      → getMaintenanceRecords
   - GET    /api/maintenance/:id  → getOneMaintenanceRecord
   - POST   /api/maintenance      → createMaintenanceRecord (with validation)
   - PUT    /api/maintenance/:id  → updateMaintenanceRecord (with validation)
   - DELETE /api/maintenance/:id  → deleteMaintenanceRecord

   **ChecklistTask Routes** (new):
   - GET    /api/task      → getChecklistTasks
   - GET    /api/task/:id  → getOneChecklistTask
   - POST   /api/task      → createChecklistTask (with validation)
   - PUT    /api/task/:id  → updateChecklistTask (with validation)
   - DELETE /api/task/:id  → deleteChecklistTask

3. VALIDATION UPDATES:
   - Asset validation: body('name').isString()
   - Maintenance validation:
     * body('title').isString()
     * body('body').isString()
     * body('assetId').isString() (not productId)
     * body('status').isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'EMERGENCY_REPAIR'])
   - Task validation:
     * body('name').isString().isLength({ max: 255 })
     * body('description').isString()
     * body('maintenanceRecordId').isString()

4. MIDDLEWARE:
   - Keep protect middleware on all /api/* routes
   - Maintain existing error handling

Requirements:
- Remove old product/update route definitions
- Ensure all routes are protected by JWT middleware
- Test that validation chains are correct
- Maintain handleInputErrors middleware integration

Output: Complete refactored `src/router.ts` file
```

**Expected Outcome**:

- Router with new endpoint names
- Validation updated for new models
- All routes properly protected

---

### ✅ **STEP 2.3: Test File Updates** - COMPLETED

**Objective**: Update test files to reflect new model names and endpoints.

#### 📋 **PROMPT 2.5: Refactor Integration Tests**

```
Context: I have refactored the GridOps API from Product/Update models to Asset/MaintenanceRecord models. The test files still reference old model names and endpoints.

Task: Update all test files to match the new API structure:

1. FILES TO UPDATE:
   - `src/__test__/routes.test.ts`
   - `src/handlers/__tests__/user.test.ts`
   - `integration.test.ts`

2. TEST UPDATES FOR routes.test.ts:
   - Update endpoint calls: `/api/product` → `/api/asset`
   - Update endpoint calls: `/api/update` → `/api/maintenance`
   - Update test descriptions: "should get products" → "should get assets"
   - Update mock data creation: `prisma.product.create()` → `prisma.asset.create()`
   - Update status values in tests to use new enum

3. TEST UPDATES FOR user.test.ts:
   - Update any product creation in test setup
   - Ensure JWT token generation still works
   - Update response expectations if needed

4. TEST UPDATES FOR integration.test.ts:
   - Update full workflow tests (create user → create asset → create maintenance record)
   - Update endpoint URLs
   - Update response field assertions
   - Add test for ChecklistTask creation

5. PRISMA MOCK UPDATES (if using jest.mock):
   - Update mocked Prisma client method names
   - Ensure mock data structure matches new schema

Requirements:
- All tests should pass after refactoring
- Maintain test coverage levels
- Update test descriptions to be semantically accurate
- Ensure cleanup/teardown still works

Output: Show updated test files with all model references changed
```

**Expected Outcome**:

- All tests reference new models and endpoints
- Tests pass with new schema
- Test descriptions are semantically accurate

---

## 🔒 Phase 3: Security Hardening

### **STEP 3.1: Add Helmet & Rate Limiting**

**Objective**: Implement production-grade security middleware.

#### 📋 **PROMPT 3.1: Security Middleware Implementation**

````
Context: I have a Node.js/Express API (GridOps) that needs production security hardening. Currently it only has JWT authentication.

Task: Install and configure security middleware for production readiness:

1. INSTALL DEPENDENCIES:
   ```bash
   npm install helmet express-rate-limit
   npm install --save-dev @types/express-rate-limit
````

2. CREATE MIDDLEWARE FILE:

   - Create `src/modules/security.ts`
   - Configure helmet with strict CSP headers
   - Configure rate limiter:
     - Window: 15 minutes
     - Max requests: 100 per IP
     - Message: "Too many requests from this IP, please try again later"
     - Skip successful requests: false

3. UPDATE server.ts:

   - Import helmet and rate limiter
   - Apply helmet() before any routes
   - Apply rate limiter before routes
   - Order: helmet → rate limiter → morgan → body parsers → routes

4. HELMET CONFIGURATION:

   ```typescript
   app.use(
     helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
         },
       },
       hsts: {
         maxAge: 31536000,
         includeSubDomains: true,
         preload: true,
       },
     })
   );
   ```

5. RATE LIMITER CONFIGURATION:

   ```typescript
   import rateLimit from "express-rate-limit";

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100,
     message: "Too many requests from this IP, please try again later",
     standardHeaders: true,
     legacyHeaders: false,
   });
   ```

6. TYPESCRIPT COMPLIANCE:
   - Ensure all imports have proper types
   - No 'any' types allowed
   - Strict mode enabled

Requirements:

- Middleware should not break existing functionality
- Rate limiter should apply to ALL routes (including /user and /signin)
- Helmet should allow Swagger UI to render (if implementing later)
- Add console.log statements to verify middleware is loaded

Output: Updated server.ts with security middleware properly configured

````

**Expected Outcome**:
- Helmet protecting HTTP headers
- Rate limiting preventing abuse
- No TypeScript errors
- API still functional with added security

**Validation**:
```bash
# Test rate limiting
for i in {1..101}; do curl -X GET http://localhost:3000/api/asset; done
# Should get rate limit error after 100 requests
````

---

## 📚 Phase 4: API Documentation (Swagger)

### **STEP 4.1: Swagger Setup**

**Objective**: Add interactive API documentation with Swagger UI.

#### 📋 **PROMPT 4.1: Swagger Configuration**

````
Context: I need to add Swagger/OpenAPI documentation to the GridOps Express/TypeScript API so clients can test endpoints visually.

Task: Install and configure Swagger UI Express:

1. INSTALL DEPENDENCIES:
   ```bash
   npm install swagger-ui-express swagger-jsdoc
   npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
````

2. CREATE CONFIG FILE `src/config/swagger.ts`:

   - Define OpenAPI 3.0 specification
   - Metadata:
     - Title: "GridOps API"
     - Version: "1.0.0"
     - Description: "Industrial Asset Lifecycle Management API - Track maintenance records for electrical infrastructure"
     - Contact: Your professional email
   - Server: http://localhost:3000
   - Security schemes: JWT Bearer token
   - Components:
     - Define schemas for: User, Asset, MaintenanceRecord, ChecklistTask
     - Define security schemes (bearerAuth)

3. SWAGGER CONFIG STRUCTURE:

   ```typescript
   import swaggerJsdoc from "swagger-jsdoc";

   const options = {
     definition: {
       openapi: "3.0.0",
       info: {
         title: "GridOps API",
         version: "1.0.0",
         description: "Industrial Asset Lifecycle Management API",
       },
       servers: [
         { url: "http://localhost:3000", description: "Development server" },
       ],
       components: {
         securitySchemes: {
           bearerAuth: {
             type: "http",
             scheme: "bearer",
             bearerFormat: "JWT",
           },
         },
         schemas: {
           // Define schemas here
         },
       },
       security: [{ bearerAuth: [] }],
     },
     apis: ["./src/handlers/*.ts", "./src/router.ts"], // Path to annotated files
   };

   export const swaggerSpec = swaggerJsdoc(options);
   ```

4. UPDATE server.ts:

   - Import swagger-ui-express and swaggerSpec
   - Add route: `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))`
   - Place AFTER helmet (ensure CSP allows Swagger UI inline styles)

5. SCHEMA DEFINITIONS:
   - Add complete TypeScript-style schemas for all models
   - Include all fields with proper types
   - Document relationships

Requirements:

- Swagger UI should render at http://localhost:3000/api-docs
- All schemas should be properly typed
- JWT auth should be configurable in Swagger UI
- No TypeScript compilation errors

Output:

1. Complete src/config/swagger.ts file
2. Updated server.ts with Swagger route

```

**Expected Outcome**:
- Swagger UI accessible at `/api-docs`
- Basic structure visible (no documented endpoints yet)
- Schema definitions present

---

### **STEP 4.2: Endpoint Documentation**

**Objective**: Add JSDoc annotations to generate Swagger documentation for all endpoints.

#### 📋 **PROMPT 4.2: Document Asset Endpoints**

```

Context: I have Swagger UI configured for the GridOps API. Now I need to add JSDoc annotations to the Asset handler endpoints.

Task: Add Swagger annotations to `src/handlers/asset.ts`:

1. DOCUMENTATION PATTERN (for each function):

   **GET /api/asset** (getAssets):

   ```typescript
   /**
    * @swagger
    * /api/asset:
    *   get:
    *     summary: List all assets
    *     description: Retrieve all industrial assets owned by the authenticated user
    *     tags: [Assets]
    *     security:
    *       - bearerAuth: []
    *     responses:
    *       200:
    *         description: List of assets
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Asset'
    *       401:
    *         description: Unauthorized - Invalid or missing JWT token
    */
   ```

   **POST /api/asset** (createAsset):

   ```typescript
   /**
    * @swagger
    * /api/asset:
    *   post:
    *     summary: Register a new asset
    *     description: Create a new industrial equipment record
    *     tags: [Assets]
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - name
    *             properties:
    *               name:
    *                 type: string
    *                 description: Equipment identifier (e.g., "Turbine-TR-505")
    *                 example: "Generator-X-500"
    *     responses:
    *       200:
    *         description: Asset created successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   $ref: '#/components/schemas/Asset'
    *       400:
    *         description: Invalid input
    *       401:
    *         description: Unauthorized
    */
   ```

2. REPEAT FOR ALL ENDPOINTS:

   - GET /api/asset/:id
   - PUT /api/asset/:id
   - DELETE /api/asset/:id

3. ADD SCHEMA DEFINITION (in swagger.ts):
   ```typescript
   Asset: {
     type: 'object',
     properties: {
       id: { type: 'string', format: 'uuid' },
       name: { type: 'string', example: 'Transformer-T-100' },
       belongsToId: { type: 'string', format: 'uuid' },
       createdAt: { type: 'string', format: 'date-time' }
     }
   }
   ```

Requirements:

- Every endpoint must have summary, description, tags, security
- Use proper HTTP status codes
- Include example values
- Reference schemas using $ref
- Tag all Asset endpoints with [Assets]

Output: Updated asset.ts with complete Swagger annotations

```

**Expected Outcome**:
- All Asset endpoints visible in Swagger UI
- "Try it out" button works with JWT token
- Request/response examples are clear

---

#### 📋 **PROMPT 4.3: Document Maintenance & Task Endpoints**

```

Context: I have documented the Asset endpoints in Swagger. Now I need to document MaintenanceRecord and ChecklistTask endpoints.

Task: Add Swagger annotations to maintenance.ts and task.ts:

1. MAINTENANCE ENDPOINTS (src/handlers/maintenance.ts):

   - Tag all with [Maintenance Records]
   - Document status enum values: SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR
   - Include example:
     ```json
     {
       "title": "Annual Safety Inspection",
       "body": "Checked all safety systems. Voltage output stable.",
       "assetId": "uuid-here",
       "status": "COMPLETED",
       "version": "FW-2.3.1"
     }
     ```

2. TASK ENDPOINTS (src/handlers/task.ts):

   - Tag all with [Checklist Tasks]
   - Document relationship to MaintenanceRecord
   - Include example:
     ```json
     {
       "name": "Voltage Output Checked",
       "description": "Output stable at 240V",
       "maintenanceRecordId": "uuid-here"
     }
     ```

3. UPDATE SCHEMA DEFINITIONS (swagger.ts):

   - MaintenanceRecord schema with all fields
   - ChecklistTask schema with all fields
   - UpdateStatus enum definition

4. AUTHENTICATION ENDPOINTS:
   - Document POST /user (registration)
   - Document POST /signin (login)
   - Tag with [Authentication]
   - Mark as NOT requiring bearerAuth

Requirements:

- Clear description of domain context (maintenance workflow)
- Proper enum documentation
- Example values reflect industrial use case
- All relationships clearly documented

Output:

1. Updated maintenance.ts with annotations
2. Updated task.ts with annotations
3. Updated swagger.ts with schemas
4. Documentation for auth endpoints

```

**Expected Outcome**:
- Complete API documentation in Swagger UI
- All endpoints testable
- Clear examples for industrial use case

---

## 🚀 Phase 5: Professional Packaging

### **STEP 5.1: README Rewrite**

**Objective**: Replace academic README with professional product documentation.

#### 📋 **PROMPT 5.1: Professional README**

```

Context: I have completed the GridOps API transformation. The current README is generic and academic. I need a professional README suitable for a portfolio or client presentation.

Task: Write a new README.md with the following structure:

1. HEADER:

   ```markdown
   # ⚡ GridOps: Industrial Asset Lifecycle API

   > Enterprise-grade backend for managing maintenance records of critical electrical infrastructure

   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
   ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
   ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
   ```

2. SECTIONS:

   **Project Overview**:

   - Business problem: Replacing paper maintenance logs
   - Target users: Field engineers, site managers
   - Value proposition: Searchable, immutable maintenance history

   **Key Features**:

   - ✅ JWT-based authentication
   - ✅ Asset lifecycle tracking (generators, transformers, panels)
   - ✅ Maintenance record management with status workflow
   - ✅ Granular checklist task logging
   - ✅ User-scoped data access (multi-tenant ready)
   - ✅ Interactive API documentation (Swagger UI)
   - ✅ Production security (Helmet, Rate Limiting)
   - ✅ Type-safe database access (Prisma ORM)

   **Tech Stack**:

   - Detailed list with justifications

   **Quick Start**:

   ```bash
   # Clone repository
   git clone https://github.com/yourusername/gridops-api.git
   cd gridops-api

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your DATABASE_URL and JWT_SECRET

   # Run migrations
   npx prisma migrate dev

   # Start development server
   npm run dev

   # Access API documentation
   open http://localhost:3000/api-docs
   ```

   **API Endpoints Overview**:

   - Table format with endpoints, methods, and descriptions

   **Database Schema**:

   - ERD description: User → Asset → MaintenanceRecord → ChecklistTask

   **Security Features**:

   - List security implementations

   **Testing**:

   ```bash
   npm test
   ```

   **Deployment**:

   - Instructions for Render/Railway
   - Environment variables needed

   **Use Cases**:

   - Real-world scenarios

   **License**:

   - MIT or proprietary

   **Contact**:

   - Your professional contact info

Requirements:

- Professional tone (avoid academic language)
- Clear business value proposition
- Visual elements (badges, code blocks)
- Copy-paste ready commands
- Suitable for portfolio/client presentation

Output: Complete README.md file

```

**Expected Outcome**:
- Professional README that showcases technical skills
- Clear value proposition
- Easy to follow setup instructions

---

### **STEP 5.2: Environment Configuration**

**Objective**: Ensure deployment readiness with proper configuration files.

#### 📋 **PROMPT 5.2: Deployment Configuration**

```

Context: I need to prepare the GridOps API for deployment to cloud platforms (Render, Railway, Heroku).

Task: Create deployment configuration and verify build scripts:

1. CREATE .env.example:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gridops?schema=public"

   # Authentication
   JWT_SECRET="your-secret-key-change-in-production"

   # Server
   PORT=3000
   NODE_ENV=production
   ```

2. VERIFY package.json SCRIPTS:

   - Ensure "build" script exists: `"build": "tsc"`
   - Ensure "start" script exists: `"start": "node dist/index.js"`
   - Add "postinstall" script: `"postinstall": "prisma generate"`

3. CREATE .gitignore (if not exists):

   ```
   node_modules/
   dist/
   .env
   .DS_Store
   *.log
   ```

4. CREATE Procfile (for Heroku):

   ```
   web: npm start
   ```

5. UPDATE tsconfig.json (verify):

   - "outDir": "dist"
   - "rootDir": "src"
   - "strict": true

6. DEPLOYMENT CHECKLIST DOCUMENT:
   Create DEPLOYMENT.md with:
   - Required environment variables
   - Database migration steps
   - Platform-specific instructions (Render, Railway)
   - Post-deployment verification steps

Requirements:

- All sensitive data in .env (not committed)
- Build process produces clean dist/ folder
- Prisma client generation automated
- TypeScript compilation successful

Output:

1. .env.example file
2. Updated package.json (if needed)
3. DEPLOYMENT.md guide
4. Verification that `npm run build` works

```

**Expected Outcome**:
- Deployment-ready configuration
- Clear deployment documentation
- Automated build process

---

## ✅ Phase 6: Validation & Testing

### **STEP 6.1: Comprehensive Testing**

**Objective**: Verify all transformations are successful and API is fully functional.

#### 📋 **PROMPT 6.1: End-to-End Validation**

```

Context: I have completed the GridOps transformation. I need to validate that everything works correctly.

Task: Perform comprehensive testing and create a validation checklist:

1. DATABASE VALIDATION:

   - Run `npx prisma studio`
   - Verify tables: User, Asset, MaintenanceRecord, ChecklistTask
   - Verify relationships are correct
   - Check that Status enum values are correct

2. BUILD VALIDATION:

   - Run `npm run build`
   - Verify no TypeScript errors
   - Check dist/ folder is generated
   - Verify all files compiled

3. UNIT TEST VALIDATION:

   - Run `npm test`
   - Verify all tests pass
   - Check coverage is maintained
   - Fix any failing tests

4. API FUNCTIONAL TESTING:

   - Start server: `npm run dev`
   - Test workflow:
     a. POST /user (create account)
     b. POST /signin (get JWT token)
     c. GET /api/asset (empty array initially)
     d. POST /api/asset (create "Transformer-T-1")
     e. POST /api/maintenance (create maintenance record for asset)
     f. POST /api/task (create checklist task for record)
     g. GET /api/maintenance/:id (verify full record with tasks)

5. SWAGGER UI TESTING:

   - Visit http://localhost:3000/api-docs
   - Click "Authorize" button
   - Paste JWT token
   - Try "Execute" on GET /api/asset
   - Verify response appears correctly

6. SECURITY TESTING:

   - Test rate limiting (make 101 requests rapidly)
   - Test without JWT token (should get 401)
   - Test with invalid JWT (should get 401)
   - Verify Helmet headers in browser dev tools

7. CREATE VALIDATION REPORT:
   Create VALIDATION_REPORT.md documenting:
   - All tests performed
   - Results (pass/fail)
   - Screenshots of Swagger UI
   - Sample API responses
   - Performance metrics (optional)

Requirements:

- Document any issues found
- Provide fix suggestions
- Create reproducible test scripts
- Verify production readiness

Output: VALIDATION_REPORT.md with all test results

```

**Expected Outcome**:
- Fully functional API
- All tests passing
- Documentation verified
- Deployment ready

---

## 📋 Final Checklist: Definition of Done

### **GridOps Transformation Complete When:**

#### ✅ Phase 1: Database ✓ **COMPLETED**
- [x] Prisma schema uses Asset, MaintenanceRecord, ChecklistTask ✓
- [x] Status enum: SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR ✓
- [x] Prisma Client generated with new types ✓
- [ ] Database migration successful (pending database connection)
- [ ] Prisma Studio shows correct table names (pending migration)

**Completion Docs**: PHASE_1.1_COMPLETION.md, PHASE_1.2_COMPLETION.md

#### ✅ Phase 2: Code ✓ **COMPLETED** (Tests Pending)
- [x] All handlers renamed (asset.ts, maintenance.ts, task.ts) ✓
- [x] Router uses /api/asset, /api/maintenance, /api/task ✓
- [x] All variables use new terminology (no "product" or "update") ✓
- [x] TypeScript compiles with no errors (npm run build succeeds) ✓
- [ ] All tests updated and passing (npm test succeeds) - NEXT STEP

**Completion Docs**: PHASE_2.1_COMPLETION.md, PHASE_2.2_COMPLETION.md, PHASE_2.3_COMPLETION.md, PHASE_2.4_COMPLETION.md

#### ✅ Phase 3: Security
- [ ] Helmet installed and configured
- [ ] Rate limiting active (100 req/15min)
- [ ] Security middleware in correct order in server.ts
- [ ] No security warnings in npm audit

#### ✅ Phase 4: Documentation
- [ ] Swagger UI accessible at /api-docs
- [ ] All endpoints documented with JSDoc annotations
- [ ] "Authorize" button works with JWT token
- [ ] All endpoints testable via "Try it out"
- [ ] Schemas visible in Swagger UI

#### ✅ Phase 5: Professional Packaging
- [ ] README.md is professional and portfolio-ready
- [ ] .env.example created with all variables
- [ ] Build scripts verified (build, start, postinstall)
- [ ] DEPLOYMENT.md guide created
- [ ] .gitignore excludes sensitive files

#### ✅ Phase 6: Validation
- [ ] Can create user and receive JWT token
- [ ] Can create asset via Swagger UI
- [ ] Can create maintenance record for asset
- [ ] Can create checklist task for record
- [ ] Rate limiting triggers after 100 requests
- [ ] Unauthorized requests return 401

### **Portfolio Presentation Ready When:**
- [ ] GitHub repo has descriptive name (gridops-api)
- [ ] Professional README with badges and screenshots
- [ ] Live deployment URL (Render/Railway)
- [ ] Swagger documentation accessible publicly
- [ ] Code is clean, well-commented, and follows best practices

---

## 🎯 Success Metrics

**Technical Excellence:**
- Zero TypeScript errors
- 100% test passage rate
- No security vulnerabilities (npm audit)
- API response time < 200ms average

**Professional Presentation:**
- README is client/employer ready
- Swagger UI is intuitive and complete
- Code demonstrates senior-level patterns
- Deployment is one-click ready

**Domain Transformation:**
- All terminology reflects industrial asset management
- No remnants of "changelog" language
- Semantic consistency across codebase
- Business value is clear from documentation

---

## 📚 Appendix: Quick Reference

### **Model Mapping Reference**
| Old (API-v4) | New (GridOps) | Purpose |
|--------------|---------------|---------|
| Product | Asset | Physical equipment |
| Update | MaintenanceRecord | Service event |
| UpdatePoint | ChecklistTask | Task line item |
| IN_PROGRESS | IN_PROGRESS | Maintenance ongoing |
| SHIPPED | COMPLETED | Service finished |
| DEPRECATED | EMERGENCY_REPAIR | Critical failure |

### **Endpoint Mapping Reference**
| Old Endpoint | New Endpoint | Action |
|--------------|--------------|--------|
| GET /api/product | GET /api/asset | List assets |
| POST /api/update | POST /api/maintenance | Create service record |
| GET /api/updatepoint | GET /api/task | List tasks |

### **File Renaming Reference**
| Old File | New File | Contains |
|----------|----------|----------|
| src/handlers/product.ts | src/handlers/asset.ts | Asset CRUD |
| src/handlers/update.ts | src/handlers/maintenance.ts | Maintenance CRUD |
| N/A | src/handlers/task.ts | Task CRUD (new) |

---

## 🤖 AI Assistant Usage Notes

**For AI Assistants Processing This Document:**

1. **Context Awareness**: Each prompt is self-contained but builds on previous steps
2. **Validation**: Always verify the previous step succeeded before proceeding
3. **Error Handling**: If a step fails, diagnose the issue before moving forward
4. **Code Quality**: Maintain strict TypeScript compliance throughout
5. **Incremental Progress**: Complete one phase fully before starting the next
6. **User Communication**: Explain what you're doing and why at each step

**Recommended Workflow:**
1. Read the entire guide first to understand the transformation scope
2. Execute prompts in sequential order (don't skip steps)
3. After each major phase, run validation tests
4. Keep the user informed of progress and blockers
5. Suggest improvements if you identify technical debt

---

**Document Version**: 1.0
**Last Updated**: 2026-01-15
**Maintained By**: GridOps Development Team
```
