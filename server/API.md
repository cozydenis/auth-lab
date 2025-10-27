# API Documentation

## Overview

The Auth Lab server provides a RESTful API for user authentication and profile management. The API supports both traditional email/password authentication and Google OAuth integration, using session-based authentication for maintaining user state.

## Base URL

```
http://localhost:4000
```

## Authentication

The API uses session-based authentication with HTTP-only cookies. Sessions are maintained server-side and identified by a signed session cookie (`sid`).

### Session Configuration
- **Cookie Name**: `sid`
- **HttpOnly**: `true` (prevents XSS)
- **SameSite**: `lax` (CSRF protection)
- **Secure**: `false` (development), `true` (production with HTTPS)
- **Max Age**: 1 hour

## API Endpoints

### Health Check

#### GET /health
Simple health check endpoint.

**Response:**
```json
{
  "ok": true
}
```

---

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Validation Rules:**
- `email`: Valid email format
- `password`: 8-128 characters

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": ""
}
```

**Error Responses:**
- `400` - Invalid input or email already registered
- `500` - Server error

---

#### POST /auth/login
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "John"
}
```

**Error Responses:**
- `400` - Invalid input format
- `401` - Invalid credentials
- `500` - Server error

---

#### GET /auth/me
Get current authenticated user information.

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "John"
}
```

**Response when not authenticated:**
```json
null
```

---

#### POST /auth/logout
End the current user session.

**Success Response (200):**
```json
{
  "ok": true
}
```

---

### Google OAuth Endpoints

#### GET /auth/google
Initiate Google OAuth flow. Redirects to Google consent screen.

**Query Parameters:**
- Automatically includes `scope=email,profile`

**Response:**
- `302` - Redirect to Google OAuth consent screen

---

#### GET /auth/google/callback
Handle Google OAuth callback (internal use).

**Query Parameters:**
- `code` - Authorization code from Google
- `state` - Optional state parameter

**Response:**
- `302` - Redirect to client application on success
- `302` - Redirect to `/auth/failure` on error

---

#### GET /auth/failure
OAuth failure endpoint.

**Response (401):**
```json
{
  "error": "Google auth failed"
}
```

---

### User Profile Endpoints

**Note:** All user endpoints require authentication.

#### GET /api/users/:id/nickname
Get user's nickname (owner only).

**Path Parameters:**
- `id` - User ID

**Success Response (200):**
```json
{
  "nickname": "John Doe"
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Forbidden (trying to access another user's data)
- `500` - Server error

---

#### PUT /api/users/:id/nickname
Update user's nickname (owner only).

**Path Parameters:**
- `id` - User ID

**Request Body:**
```json
{
  "nickname": "New Nickname"
}
```

**Validation Rules:**
- `nickname`: Trimmed string, max 50 characters

**Success Response (200):**
```json
{
  "nickname": "New Nickname"
}
```

**Error Responses:**
- `400` - Invalid input
- `401` - Not authenticated
- `403` - Forbidden (trying to update another user's data)
- `500` - Server error

---

### Debug Endpoints

**Note:** These endpoints are for development only and should be removed in production.

#### GET /debug/users
List first 5 users in the database.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "email": "user1@example.com",
    "nickname": "User One",
    "provider": "local",
    "providerId": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### GET /debug/session
Test session persistence with view counter.

**Success Response (200):**
```json
{
  "message": "Session alive",
  "views": 3,
  "userId": 1
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `500` - Internal Server Error

### Common Error Messages

- `"Invalid input"` - Request body validation failed
- `"Email already registered"` - Registration with existing email
- `"Invalid credentials"` - Login with wrong email/password
- `"Unauthorized"` - Authentication required
- `"Forbidden"` - Insufficient permissions
- `"Server error"` - Internal server error

---

## Security Features

### Password Security
- **Hashing**: Argon2id (memory-hard, GPU-resistant)
- **Minimum Length**: 8 characters
- **Maximum Length**: 128 characters

### Session Security
- **HttpOnly Cookies**: Prevent XSS attacks
- **SameSite Protection**: Mitigate CSRF attacks
- **Signed Cookies**: Prevent tampering
- **Session Timeout**: 1 hour automatic expiration

### Input Validation
- **Zod Schemas**: Runtime type validation
- **Email Validation**: RFC-compliant email format
- **Length Limits**: Prevent buffer overflow attacks
- **Sanitization**: Automatic trimming and normalization

### Error Handling
- **Generic Messages**: Prevent user enumeration
- **No Stack Traces**: Production error responses exclude sensitive information
- **Logging**: Detailed server-side logging for debugging

---

## Rate Limiting

**Note:** Rate limiting is not currently implemented but should be added for production:

- Login attempts: 5 per minute per IP
- Registration: 3 per minute per IP  
- Password reset: 3 per hour per email
- General API: 100 requests per minute per IP

---

## CORS Configuration

- **Allowed Origin**: `http://localhost:5173` (configurable via `CLIENT_ORIGIN`)
- **Credentials**: Enabled (allows cookies)
- **Methods**: All standard HTTP methods
- **Headers**: All standard headers

---

## Database Schema

### User Model

```sql
CREATE TABLE User (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  email        TEXT UNIQUE NOT NULL,
  passwordHash TEXT,                    -- NULL for OAuth-only accounts
  provider     TEXT DEFAULT 'local',    -- 'local' or 'google'
  providerId   TEXT,                    -- OAuth provider user ID
  nickname     TEXT DEFAULT '',
  createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

Required environment variables for the server:

```env
# Database
DATABASE_URL="file:./dev.db"

# Session
SESSION_SECRET="your-super-secret-session-key-min-32-characters"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# CORS
CLIENT_ORIGIN="http://localhost:5173"

# Server (optional)
PORT=4000
```