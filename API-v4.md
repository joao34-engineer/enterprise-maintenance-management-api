# API-v4 Documentation

## Project Overview

This is a RESTful API service built with Node.js, Express, and TypeScript that provides a product changelog and update management system. The API enables users to manage products and track updates/changes to those products in a structured way.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest & Supertest
- **Validation**: express-validator
- **Logging**: Morgan

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
src/
├── handlers/        # Request handlers (controllers)
├── modules/         # Core modules (auth, middleware)
├── config/          # Environment-specific configurations
└── generated/       # Prisma client auto-generated code
```

## Data Models

### User

- `id`: Unique identifier (UUID)
- `username`: Unique username
- `password`: Hashed password
- `createdAt`: Timestamp
- **Relations**: One-to-many with Products

### Product

- `id`: Unique identifier (UUID)
- `name`: Product name (max 255 chars)
- `belongsToid`: Reference to User
- `createdAt`: Timestamp
- **Relations**: Belongs to User, has many Updates

### Update

- `id`: Unique identifier (UUID)
- `title`: Update title
- `body`: Update description
- `status`: Enum (IN_PROGRESS, SHIPPED, DEPRECATED)
- `version`: Optional version string
- `asset`: Optional asset reference
- `productId`: Reference to Product
- `createdAt`: Timestamp
- `updateAt`: Auto-updated timestamp
- **Relations**: Belongs to Product, has many UpdatePoints

### UpdatePoint

- `id`: Unique identifier (UUID)
- `name`: Point name (max 255 chars)
- `description`: Point description
- `updateId`: Reference to Update
- `createdAt`: Timestamp
- `updateAt`: Timestamp
- **Relations**: Belongs to Update

## API Endpoints

### Authentication Endpoints

#### Create User

```
POST /user
Body: { username: string, password: string }
Response: { token: string }
```

#### Sign In

```
POST /signin
Body: { username: string, password: string }
Response: { token: string }
```

### Protected API Routes

All `/api/*` routes require JWT authentication via `Authorization: Bearer <token>` header.

### Product Endpoints

#### Get All Products

```
GET /api/product
Response: { data: Product[] }
```

#### Get One Product

```
GET /api/product/:id
Response: { data: Product }
```

#### Create Product

```
POST /api/product
Body: { name: string }
Response: { data: Product }
```

#### Update Product

```
PUT /api/product/:id
Body: { name: string }
Response: { data: Product }
```

#### Delete Product

```
DELETE /api/product/:id
Response: { data: Product }
```

### Update Endpoints

#### Get All Updates

```
GET /api/update
Response: { data: Update[] }
```

#### Get One Update

```
GET /api/update/:id
Response: { data: Update }
```

#### Create Update

```
POST /api/update
Body: {
  title: string,
  body: string,
  productId: string
}
Response: { data: Update }
```

#### Update an Update

```
PUT /api/update/:id
Body: {
  title?: string,
  body?: string,
  status?: 'IN_PROGRESS' | 'SHIPPED' | 'DEPRECATED',
  version?: string
}
Response: { data: Update }
```

#### Delete Update

```
DELETE /api/update/:id
Response: { data: Update }
```

### UpdatePoint Endpoints

#### Get All UpdatePoints

```
GET /api/updatepoint
```

#### Get One UpdatePoint

```
GET /api/updatepoint/:id
```

#### Create UpdatePoint

```
POST /api/updatepoint
Body: {
  name: string,
  description: string,
  updateId: string
}
```

#### Update UpdatePoint

```
PUT /api/updatepoint/:id
Body: {
  name?: string,
  description?: string
}
```

#### Delete UpdatePoint

```
DELETE /api/updatepoint/:id
```

**Note**: UpdatePoint endpoints are currently defined as stubs and require implementation.

## Security Features

### Authentication & Authorization

- JWT-based authentication
- Password hashing using bcrypt (salt rounds: 5)
- Protected routes middleware
- User-scoped data access (users can only access their own products/updates)

### Input Validation

- Request body validation using express-validator
- Type checking for required fields
- Status enum validation for updates

### Error Handling

- Centralized error handling middleware
- Typed error responses:
  - `401`: Authentication errors
  - `400`: Invalid input errors
  - `404`: Resource not found
  - `500`: Server errors

## Configuration

The application supports multiple environments:

- **local**: Development configuration
- **production**: Production configuration
- **testing**: Test environment configuration

Configuration files are located in `src/config/`.

## Database Migrations

The project uses Prisma migrations:

- `20250907185626_init`: Initial schema
- `20250909204601_add_username`: Added username field
- `20250910131140_init`: Schema update
- `20250910132946_init`: Schema update
- `20250910144146_update_unique_constraint`: Updated unique constraints

## Testing

- **Framework**: Jest with ts-jest preset
- **Integration Testing**: Supertest for HTTP assertion
- **Test Files**:
  - `src/handlers/__tests__/user.test.ts`
  - `src/__test__/routes.test.ts`
  - `integration.test.ts`

Run tests with:

```bash
npm test
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Key Features

1. **User Management**: User registration and authentication
2. **Product Management**: CRUD operations for products
3. **Update Tracking**: Track changes and updates to products with status management
4. **Granular Updates**: UpdatePoints for detailed change tracking
5. **User Isolation**: Each user can only access their own data
6. **Type Safety**: Full TypeScript implementation
7. **Database Migrations**: Version-controlled schema changes with Prisma
8. **Request Validation**: Input validation on all endpoints
9. **Comprehensive Testing**: Unit and integration tests

## Use Cases

This API is ideal for:

- Product changelog management
- Release notes tracking
- Feature update announcements
- Version control and deployment tracking
- Customer-facing product update feeds
- Internal product roadmap management

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing

## CORS & Middleware

- CORS enabled for cross-origin requests
- Morgan logger for HTTP request logging
- JSON and URL-encoded body parsing
- Custom middleware for logging
