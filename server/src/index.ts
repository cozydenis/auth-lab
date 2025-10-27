/**
 * Auth Lab Server - Main Application Entry Point
 * 
 * This file sets up the Express.js server with authentication middleware,
 * security configurations, and API routes. The server supports both local
 * email/password authentication and Google OAuth integration.
 * 
 * Key Features:
 * - Session-based authentication with Passport.js
 * - Security headers with Helmet
 * - CORS protection for cross-origin requests
 * - Request logging with Morgan
 * - Input validation and error handling
 */

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from './passport'; 
import userRoutes from './routes/users';  
import { prisma } from './prisma';
import { ENV } from './env';
import authRoutes from './routes/auth';
import oauthGoogleRoutes from './routes/oauth-google';
import cors from 'cors';




// Initialize Express application
const app = express();

// Trust proxy headers (important for production behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware - sets various HTTP headers for security
app.use(helmet());

// HTTP request logging middleware for development and debugging
app.use(morgan('dev'));

// Parse JSON request bodies with size limit
app.use(express.json());

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * Allows the frontend client to make requests to this server from a different origin.
 * 
 * - origin: Specifies which origins are allowed to access the server
 * - credentials: Allows cookies and authentication headers to be sent
 */
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // "http://localhost:5173"
  credentials: true,                 // allow sending cookies
}));


/**
 * SESSION MIDDLEWARE CONFIGURATION
 * 
 * Sets up Express sessions for maintaining user authentication state.
 * Sessions are stored server-side with only a session ID cookie sent to client.
 * 
 * Security Features:
 * - HttpOnly cookie prevents JavaScript access (XSS protection)
 * - SameSite=Lax prevents most CSRF attacks
 * - Custom cookie name ('sid') instead of default
 * - Signed cookies prevent tampering
 * 
 * Configuration Notes:
 * - resave: false - don't save session if unchanged
 * - saveUninitialized: false - don't create empty sessions
 * - secure: false for local development (set true for HTTPS in production)
 * - maxAge: 1 hour session lifetime
 * 
 * Production Warning: MemoryStore is used for development. 
 * Use Redis or database store for production!
 */
app.use(
    session({
        name: 'sid',                    // Custom cookie name
        secret: ENV.SESSION_SECRET,     // Secret key for signing cookies
        resave: false,                  // Don't resave unchanged sessions
        saveUninitialized: false,       // Don't create empty sessions
        cookie: {
            httpOnly: true,             // Prevent XSS attacks
            sameSite: 'lax',           // CSRF protection
            secure: false,             // Set true for HTTPS in production
            maxAge: 1000 * 60 * 60,    // 1 hour expiration
        },
    })
);

/**
 * HEALTH CHECK ENDPOINT
 * Simple endpoint to verify the server is running and responsive.
 * Useful for load balancers, monitoring systems, and deployment health checks.
 * 
 * @route GET /health
 * @returns {object} 200 - Success response with ok: true
 */
app.get('/health', (_req, res) => res.json({ ok: true }));

/**
 * DEBUG ENDPOINT: List Users
 * Development utility to verify Prisma database connection and see user data.
 * Returns the first 5 users from the database.
 * 
 * @route GET /debug/users
 * @returns {array} 200 - Array of user objects (limited to 5)
 * @security None - Should be removed or protected in production
 */
app.get('/debug/users', async (_req, res) => {
    const users = await prisma.user.findMany({ take: 5 });
    res.json(users);
});

/**
 * DEBUG ENDPOINT: Session Testing
 * Development utility to test session persistence across requests.
 * Increments a counter stored in the session on each request.
 * 
 * @route GET /debug/session
 * @returns {object} 200 - Session info including view count and user ID
 * @security None - Should be removed or protected in production
 */
app.get('/debug/session', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    res.json({ 
        message: 'Session alive', 
        views: req.session.views, 
        userId: req.session.userId ?? null 
    });
});
/**
 * PASSPORT MIDDLEWARE INITIALIZATION
 * 
 * Passport.js handles authentication strategies and session management.
 * Must be initialized after session middleware but before route handlers.
 * 
 * - passport.initialize(): Sets up Passport middleware
 * - passport.session(): Enables persistent login sessions
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * ROUTE MOUNTING
 * 
 * Mount different route modules with their respective base paths:
 * - /api/users: User profile management (requires authentication)
 * - /auth: Local authentication (register, login, logout, me)  
 * - /auth: OAuth providers (Google authentication flow)
 */
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/auth', oauthGoogleRoutes);

/**
 * GLOBAL ERROR HANDLER
 * 
 * Catches any unhandled errors from route handlers and middleware.
 * Logs the full error for debugging and returns a generic message to client.
 * 
 * Security Note: Generic error messages prevent information disclosure
 * that could help attackers understand the system internals.
 * 
 * @param {Error} err - The error object
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function (unused)
 */
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});



/**
 * SERVER STARTUP
 * 
 * Start the Express server on the specified port.
 * Port can be configured via PORT environment variable or defaults to 4000.
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));


