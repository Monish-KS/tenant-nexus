# TenantNexus - Multi-Tenant Organization Management Service

A backend service built with Express.js and TypeScript for managing organizations in a multi-tenant architecture. Each organization gets its own MongoDB collection, and the system maintains a master database for global metadata.

This is a submission for The Wedding Company

## Features

- ✅ Create organizations with dynamic MongoDB collections
- ✅ Admin user management with JWT authentication
- ✅ Update organizations (including collection renaming)
- ✅ Delete organizations (with authentication)
- ✅ Secure password hashing with bcrypt
- ✅ Input validation and error handling
- ✅ Clean, modular architecture

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
cd tenantnexus
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-random-secret-key-here
PORT=3000
```

**Getting MongoDB Atlas Connection String:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (or use existing)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `tenantnexus`)

**Generating JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Organization Management

#### Create Organization
```http
POST /org/create
Content-Type: application/json

{
  "organization_name": "Acme Corp",
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

#### Get Organization
```http
GET /org/get?organization_name=Acme%20Corp
```

#### Update Organization
```http
PUT /org/update
Content-Type: application/json

{
  "organization_name": "Acme Corp",
  "new_organization_name": "Acme Corporation",  // optional
  "email": "newadmin@acme.com",                 // optional
  "password": "newpassword123"                  // optional
}
```

#### Delete Organization
```http
DELETE /org/delete?organization_name=Acme%20Corp
Authorization: Bearer <jwt_token>
```

### Authentication

#### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "email": "admin@acme.com",
      "organizationId": "507f1f77bcf86cd799439011"
    }
  }
}
```

Use the returned `token` in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <token>
```

### Health Check
```http
GET /health
```

## Project Structure

```
tenantnexus/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── Organization.ts      # Organization schema
│   │   └── Admin.ts             # Admin user schema
│   ├── controllers/
│   │   ├── orgController.ts     # Organization CRUD handlers
│   │   └── authController.ts    # Authentication handlers
│   ├── routes/
│   │   ├── orgRoutes.ts         # Organization routes
│   │   └── authRoutes.ts        # Auth routes
│   ├── services/
│   │   ├── orgService.ts        # Business logic
│   │   └── collectionService.ts # Dynamic collection management
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── errorHandler.ts      # Error handling
│   ├── utils/
│   │   ├── validation.ts        # Input validation rules
│   │   └── errors.ts            # Custom error classes
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture

### Database Structure

The system uses a single MongoDB database with:

- **Master Collections:**
  - `organizations` - Stores organization metadata
  - `admins` - Stores admin user credentials

- **Dynamic Collections:**
  - `org_<organization_name>` - One collection per organization
  - Created automatically when an organization is created
  - Renamed automatically when organization name changes

### Authentication Flow

1. Admin logs in with email/password
2. System verifies credentials
3. Returns JWT token containing:
   - `adminId` - Admin user ID
   - `organizationId` - Organization ID
   - `email` - Admin email
4. Client includes token in `Authorization: Bearer <token>` header
5. Protected endpoints verify token and extract org context

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint

### Testing the API

You can use tools like:
- **Postman** - Import the endpoints
- **curl** - Command line testing
- **Thunder Client** (VS Code extension)
- **Insomnia** - API client

Example with curl:
```bash
# Create organization
curl -X POST http://localhost:3000/org/create \
  -H "Content-Type: application/json" \
  -d '{"organization_name":"TestOrg","email":"admin@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

## Notes

- Organization names are case-insensitive and stored in lowercase
- Collection names are sanitized (spaces → underscores, lowercase)
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Only the organization's admin can delete their organization

## Troubleshooting

**Connection Error:**
- Verify your MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

**JWT Errors:**
- Make sure `JWT_SECRET` is set in `.env`
- Verify token is included in `Authorization` header
- Check token hasn't expired

**Port Already in Use:**
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000

## Architecture & Design Considerations

I think this architecture works well for what we're building here. Using a single database with dynamic collections keeps things simple - you just need one connection string and it's easy to replicate. The Express.js setup is clean and modular, so adding new features or scaling horizontally later shouldn't be too painful. The main trade-off is that we don't have the same level of isolation you'd get with separate databases per tenant, but honestly for most use cases this is totally fine. You do need to be careful with collection naming and handle migrations properly when orgs get renamed. If this were going into production with thousands of tenants, I'd probably add Redis for caching, maybe some database sharding, rate limiting per org, and a message queue for those collection migrations. But for this assignment, the current setup hits a nice sweet spot between keeping it simple and having everything work properly.

## License

ISC
