# Enterprise Maintenance Management API

> **GridOps** - Industrial Asset Lifecycle Management System

A production-ready REST API for managing industrial electrical assets, maintenance records, and checklist tasks. Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

---

## 🚀 Features

- **Asset Management** - Track physical equipment (generators, transformers, panels)
- **Maintenance Records** - Log service events, inspections, and repairs
- **Checklist Tasks** - Granular task tracking for maintenance workflows
- **JWT Authentication** - Secure user authentication and authorization
- **Role-Based Access** - Users can only access their own assets
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Security Headers** - Helmet.js protection against common vulnerabilities
- **API Documentation** - Interactive Swagger UI at `/docs`
- **Type-Safe** - Full TypeScript implementation with Prisma ORM

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

---

## 🛠 Tech Stack

- **Runtime**: Node.js v24+
- **Language**: TypeScript 5.9
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.15
- **Authentication**: JWT (jsonwebtoken + bcrypt)
- **Validation**: express-validator
- **Security**: Helmet + express-rate-limit
- **Testing**: Jest + Supertest
- **Documentation**: Swagger UI

---

## 🏁 Getting Started

### Prerequisites

- Node.js v24 or higher
- PostgreSQL 16
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/joao34-engineer/enterprise-maintenance-management-api.git
   cd enterprise-maintenance-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gridops"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Build the project**

   ```bash
   npm run build
   ```

6. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

---

## 📡 API Endpoints

### **Authentication**

| Method | Endpoint  | Description       | Auth Required |
| ------ | --------- | ----------------- | ------------- |
| POST   | `/user`   | Register new user | No            |
| POST   | `/signin` | Login user        | No            |

### **Assets**

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/api/asset`     | List all assets | Yes           |
| GET    | `/api/asset/:id` | Get asset by ID | Yes           |
| POST   | `/api/asset`     | Create asset    | Yes           |
| PUT    | `/api/asset/:id` | Update asset    | Yes           |
| DELETE | `/api/asset/:id` | Delete asset    | Yes           |

### **Maintenance Records**

| Method | Endpoint               | Description               | Auth Required |
| ------ | ---------------------- | ------------------------- | ------------- |
| GET    | `/api/maintenance`     | List maintenance records  | Yes           |
| GET    | `/api/maintenance/:id` | Get record by ID          | Yes           |
| POST   | `/api/maintenance`     | Create maintenance record | Yes           |
| PUT    | `/api/maintenance/:id` | Update record             | Yes           |
| DELETE | `/api/maintenance/:id` | Delete record             | Yes           |

### **Checklist Tasks**

| Method | Endpoint        | Description    | Auth Required |
| ------ | --------------- | -------------- | ------------- |
| GET    | `/api/task`     | List tasks     | Yes           |
| GET    | `/api/task/:id` | Get task by ID | Yes           |
| POST   | `/api/task`     | Create task    | Yes           |
| PUT    | `/api/task/:id` | Update task    | Yes           |
| DELETE | `/api/task/:id` | Delete task    | Yes           |

### **Interactive Documentation**

Visit `/docs` for Swagger UI with full API documentation and testing interface.

---

## 🔐 Authentication

All `/api/*` endpoints require JWT authentication.

1. **Register a user**:

   ```bash
   curl -X POST http://localhost:3001/user \
     -H "Content-Type: application/json" \
     -d '{"username": "john_doe", "password": "secure123"}'
   ```

2. **Login to get token**:

   ```bash
   curl -X POST http://localhost:3001/signin \
     -H "Content-Type: application/json" \
     -d '{"username": "john_doe", "password": "secure123"}'
   ```

3. **Use token in requests**:
   ```bash
   curl http://localhost:3001/api/asset \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

---

## 🗄 Database Schema

```prisma
User
  ├── id: String (UUID)
  ├── username: String (unique)
  ├── password: String (hashed)
  └── assets: Asset[]

Asset
  ├── id: String (UUID)
  ├── name: String
  ├── belongsToId: String (FK → User)
  ├── createdAt: DateTime
  └── maintenanceRecords: MaintenanceRecord[]

MaintenanceRecord
  ├── id: String (UUID)
  ├── title: String
  ├── body: String
  ├── status: Enum (SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR)
  ├── version: String (optional)
  ├── assetId: String (FK → Asset)
  ├── createdAt: DateTime
  ├── updatedAt: DateTime
  └── checklistTasks: ChecklistTask[]

ChecklistTask
  ├── id: String (UUID)
  ├── name: String
  ├── description: String
  ├── maintenanceRecordId: String (FK → MaintenanceRecord)
  ├── createdAt: DateTime
  └── updatedAt: DateTime
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run specific test file:

```bash
npm test -- integration.test.ts
```

**Test Coverage**:

- ✅ User authentication (register, login)
- ✅ Asset CRUD operations
- ✅ Maintenance record workflow
- ✅ Checklist task management
- ✅ Authorization checks
- ✅ Integration tests (full workflow)

---

## 🌍 Environment Variables

| Variable     | Description                  | Required | Default |
| ------------ | ---------------------------- | -------- | ------- |
| DATABASE_URL | PostgreSQL connection string | Yes      | -       |
| JWT_SECRET   | Secret key for JWT signing   | Yes      | -       |
| NODE_ENV     | Environment (production/dev) | No       | dev     |
| PORT         | Server port                  | No       | 3001    |

---

## 🚢 Deployment

### Deploy to Render

1. **Create PostgreSQL database** on Render
2. **Create Web Service** with these settings:
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Add environment variables: `DATABASE_URL`, `JWT_SECRET`
3. **Deploy** - Render will auto-deploy from GitHub

### Deploy to Railway/Heroku

Similar process - set environment variables and configure build/start commands.

---

## 📝 Scripts

```json
{
  "dev": "nodemon src/index.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/index.js",
  "test": "jest"
}
```

---

## 🔒 Security Features

- ✅ **Helmet.js** - Sets secure HTTP headers
- ✅ **Rate Limiting** - Prevents brute-force attacks
- ✅ **CORS** - Configurable cross-origin requests
- ✅ **JWT Authentication** - Stateless auth tokens
- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **Input Validation** - express-validator on all inputs
- ✅ **SQL Injection Protection** - Prisma parameterized queries

---

## 📚 Project Structure

```
enterprise-maintenance-management-api/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── src/
│   ├── handlers/               # Route handlers
│   │   ├── asset.ts
│   │   ├── maintenance.ts
│   │   ├── task.ts
│   │   └── user.ts
│   ├── modules/                # Middleware & utilities
│   │   ├── auth.ts
│   │   └── middleware.ts
│   ├── config/                 # Environment configs
│   ├── __test__/               # Test files
│   ├── server.ts               # Express app setup
│   ├── router.ts               # API routes
│   ├── db.ts                   # Prisma client
│   ├── swagger.ts              # Swagger config
│   └── index.ts                # Server entry point
├── integration.test.ts         # Integration tests
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**João Marcelo**

- GitHub: [@joao34-engineer](https://github.com/joao34-engineer)
- Portfolio: [Your Portfolio URL]

---

## 🙏 Acknowledgments

- Built with [Prisma](https://www.prisma.io/)
- Inspired by industrial field service management needs
- API design following REST best practices

---

**⭐ If this project helped you, please give it a star!**
