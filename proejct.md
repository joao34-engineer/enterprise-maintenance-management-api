⚡ GridOps: Industrial Asset Lifecycle API

Project Overview

GridOps is an enterprise-grade RESTful API designed to manage the lifecycle and maintenance history of critical electrical infrastructure. It allows field engineers to track industrial assets (generators, transformers, panels) and log detailed maintenance events in a structured, immutable format.

Business Value: Replaces paper logbooks with a digital, searchable history of every repair and firmware update performed on site equipment.

Tech Stack & Architecture

Core: Node.js, Express, TypeScript

Database: PostgreSQL (Relational Data Integrity)

ORM: Prisma (Type-safe database access)

Security: JWT Authentication & Bcrypt hashing

Documentation: Swagger/OpenAPI (Auto-generated)

Rebranded Domain Model (Schema Strategy)

We transformed a standard "Changelog" schema into an "Asset Maintenance" schema:

1. Asset (Formerly "Product")

Represents a physical piece of equipment.

id: UUID

name: Equipment ID (e.g., "Turbine-TR-505")

belongsToId: The Site Manager (User) responsible for this asset.

2. ServiceRecord (Formerly "Update")

Represents a specific maintenance event or inspection visit.

title: Service Type (e.g., "Annual Safety Inspection")

body: Technician Notes

status: SCHEDULED, COMPLETED, CRITICAL_FAIL (Enum)

version: Firmware Version (if applicable)

3. TaskLog (Formerly "UpdatePoint")

Granular line-items completed during the service.

name: Task Name (e.g., "Voltage Output Checked")

description: Result (e.g., "Output stable at 240V")

API Endpoints (Swagger Structure)

Asset Management

GET /api/assets - List all machinery under management

POST /api/assets - Register a new machine

GET /api/assets/:id - Get full history of a machine

Maintenance Logging

POST /api/maintenance - Create a new service record

PUT /api/maintenance/:id - Update status (e.g., from IN_PROGRESS to COMPLETED)

Task Details

POST /api/tasks - Add specific checklist items to a maintenance record

How to Run

Clone repository

npm install

npx prisma migrate dev

npm run dev

Visit http://localhost:3000/api-docs for Swagger Documentation.