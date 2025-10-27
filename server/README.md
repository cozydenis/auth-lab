# Auth Lab Server

A secure Express.js authentication server built with TypeScript, featuring both local email/password authentication and Google OAuth integration. This server uses session-based authentication with Passport.js and stores user data in a SQLite database via Prisma ORM.

## Features

- 🔐 **Local Authentication**: Email/password registration and login with Argon2 password hashing
- 🌐 **OAuth Integration**: Google OAuth 2.0 authentication
- 📊 **Session Management**: Express sessions with configurable cookie settings
- 🛡️ **Security**: Helmet for security headers, CORS protection, input validation with Zod
- 💾 **Database**: SQLite with Prisma ORM for type-safe database operations
- 🔍 **Logging**: Morgan for HTTP request logging
- 🚀 **Development**: Hot reload with ts-node-dev

## Project Structure

```
src/
├── index.ts              # Main application entry point and Express server setup
├── env.ts                # Environment variable validation and configuration
├── prisma.ts             # Prisma client initialization
├── passport.ts           # Passport authentication strategies configuration
├── validators.ts         # Zod schemas for input validation
├── routes/
│   ├── auth.ts          # Local authentication routes (register, login, logout)
│   ├── oauth-google.ts  # Google OAuth routes and callbacks
│   └── users.ts         # User profile management routes
└── types/
    └── express-session.d.ts  # TypeScript session type extensions

prisma/
├── schema.prisma        # Database schema definition
└── migrations/          # Database migration files
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Local Authentication
- `POST /auth/register` - Register new user with email/password
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout and destroy session
- `GET /auth/me` - Get current authenticated user

#### OAuth Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth callback
- `GET /auth/failure` - OAuth failure endpoint

### User Management Routes (`/api/users`)

- `GET /api/users/:id/nickname` - Get user's nickname (owner only)
- `PUT /api/users/:id/nickname` - Update user's nickname (owner only)

### Debug/Health Routes

- `GET /health` - Health check endpoint
- `GET /debug/users` - List first 5 users (development only)
- `GET /debug/session` - Session counter for testing

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Session
SESSION_SECRET="your-super-secret-session-key-min-32-characters"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# CORS
CLIENT_ORIGIN="http://localhost:5173"

# Server
PORT=4000
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:4000`

## Database Schema

The application uses a single `User` model:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String?  // null for OAuth-only accounts
  provider     String   @default("local")  // "local" or "google"
  providerId   String?  // OAuth provider user ID
  nickname     String   @default("")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Authentication Flow

### Local Authentication
1. User registers with email/password
2. Password is hashed using Argon2
3. User record created in database
4. Session established with user ID

### Google OAuth
1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back to callback URL
4. Server creates/links user account by email
5. Session established with user ID

### Session Management
- Sessions stored in memory (development) - use Redis in production
- Session cookie is HTTP-only, SameSite=Lax
- 1-hour session timeout
- User ID stored in session for quick lookup

## Security Features

- **Password Hashing**: Argon2id for secure password storage
- **Session Security**: HTTP-only cookies, SameSite protection
- **Input Validation**: Zod schemas validate all user input
- **CORS Protection**: Configured for specific client origin
- **Security Headers**: Helmet middleware for security headers
- **Generic Error Messages**: Prevent user enumeration

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npx prisma studio` - Open Prisma database browser
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

### Code Structure

Each file has a specific purpose:

- **`index.ts`**: Express app setup, middleware configuration, route mounting
- **`env.ts`**: Centralized environment variable validation
- **`passport.ts`**: Authentication strategy configuration (local + Google)
- **`validators.ts`**: Input validation schemas using Zod
- **`routes/auth.ts`**: Local authentication endpoints
- **`routes/oauth-google.ts`**: Google OAuth flow handlers
- **`routes/users.ts`**: User profile management with authorization
- **`prisma.ts`**: Database client singleton

## Error Handling

The server implements comprehensive error handling:

- Input validation errors return 400 with specific messages
- Authentication errors return 401 with generic messages
- Authorization errors return 403 for insufficient permissions
- Server errors return 500 with generic error message
- Detailed errors logged to console for debugging

## Production Considerations

Before deploying to production:

1. **Session Store**: Replace memory store with Redis
2. **Environment**: Set `NODE_ENV=production`
3. **HTTPS**: Enable secure cookies (`secure: true`)
4. **Database**: Consider PostgreSQL for better performance
5. **Secrets**: Use proper secret management
6. **Logging**: Implement structured logging
7. **Rate Limiting**: Add rate limiting middleware
8. **Monitoring**: Add health checks and metrics

## License

This project is for educational purposes.