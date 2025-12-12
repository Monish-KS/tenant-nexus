# TenantNexus API Documentation

Base URL: `http://localhost:3000`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-12T13:02:52.608Z"
}
```

---

### 2. Create Organization

**POST** `/org/create`

Create a new organization with admin user and dynamic collection.

**Request Body:**
```json
{
  "organization_name": "Acme Corp",
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organizationName": "acme corp",
    "collectionName": "org_acme_corp",
    "createdAt": "2025-12-12T13:03:59.904Z"
  }
}
```

**Validation:**
- `organization_name`: Required, 2-50 characters, alphanumeric with spaces, hyphens, underscores
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### 3. Get Organization

**GET** `/org/get?organization_name=Acme%20Corp`

Get organization details by name.

**Query Parameters:**
- `organization_name` (required): Name of the organization

**Response (200):**
```json
{
  "success": true,
  "data": {
    "organizationName": "acme corp",
    "collectionName": "org_acme_corp",
    "createdAt": "2025-12-12T13:03:59.904Z",
    "updatedAt": "2025-12-12T13:03:59.904Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Organization not found"
}
```

---

### 4. Admin Login

**POST** `/admin/login`

Authenticate admin and get JWT token.

**Request Body:**
```json
{
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "email": "admin@acme.com",
      "organizationId": "693c12bf92b429b4be5b7c44"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Note:** Token expires in 7 days. Use this token in the Authorization header for protected endpoints.

---

### 5. Update Organization

**PUT** `/org/update`

Update organization name, admin email, or password. If organization name changes, the collection is automatically renamed.

**Request Body:**
```json
{
  "organization_name": "Acme Corp",
  "new_organization_name": "Acme Corporation",
  "email": "newadmin@acme.com",
  "password": "newpassword123"
}
```

**Note:** All fields except `organization_name` are optional. Only include fields you want to update.

**Response (200):**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "organizationName": "acme corporation",
    "collectionName": "org_acme_corporation",
    "updatedAt": "2025-12-12T13:10:00.000Z"
  }
}
```

**Validation:**
- `organization_name`: Required (current name)
- `new_organization_name`: Optional, 2-50 characters
- `email`: Optional, valid email format
- `password`: Optional, minimum 6 characters

---

### 6. Delete Organization

**DELETE** `/org/delete?organization_name=Acme%20Corp`

Delete organization and its collection. Only the organization's admin can delete their own organization.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `organization_name` (required): Name of the organization to delete

**Response (200):**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "No token provided"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "You can only delete your own organization"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

**Validation Errors:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "organization_name",
      "message": "Organization name is required"
    }
  ]
}
```

---

## Example Workflow

1. **Create Organization:**
   ```bash
   POST /org/create
   {
     "organization_name": "MyCompany",
     "email": "admin@mycompany.com",
     "password": "password123"
   }
   ```

2. **Login:**
   ```bash
   POST /admin/login
   {
     "email": "admin@mycompany.com",
     "password": "password123"
   }
   ```
   Save the `token` from response.

3. **Get Organization:**
   ```bash
   GET /org/get?organization_name=MyCompany
   ```

4. **Update Organization:**
   ```bash
   PUT /org/update
   Authorization: Bearer <token>
   {
     "organization_name": "MyCompany",
     "new_organization_name": "MyCompany Inc"
   }
   ```

5. **Delete Organization:**
   ```bash
   DELETE /org/delete?organization_name=MyCompany%20Inc
   Authorization: Bearer <token>
   ```

---

## Notes

- Organization names are case-insensitive and stored in lowercase
- Collection names follow the pattern: `org_<organization_name>` (spaces replaced with underscores)
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- Only the organization's admin can delete their organization
- When organization name is updated, the collection is automatically renamed and data is migrated

