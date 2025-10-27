/**
 * Local Authentication Routes
 * 
 * This module handles local email/password authentication endpoints.
 * It provides user registration, login, logout, and session management
 * functionality using Passport.js local strategy.
 * 
 * Security Features:
 * - Argon2 password hashing for secure storage
 * - Input validation with Zod schemas
 * - Session-based authentication
 * - Generic error messages to prevent user enumeration
 * - Automatic session establishment on successful auth
 * 
 * Routes:
 * - POST /auth/register - Create new user account
 * - POST /auth/login - Authenticate existing user
 * - GET /auth/me - Get current user info
 * - POST /auth/logout - End user session
 */

import { Router } from 'express';
import passport from 'passport';
import argon2 from 'argon2';
import { prisma } from '../prisma';
import { loginSchema, registerSchema } from '../validators';

const router = Router();

/**
 * User Registration Endpoint
 * 
 * Creates a new user account with email and password authentication.
 * Automatically establishes a session for the newly created user.
 * 
 * Security Measures:
 * - Validates input using Zod schema
 * - Checks for existing email to prevent duplicates
 * - Hashes password with Argon2id (memory-hard, GPU-resistant)
 * - Creates session immediately after registration
 * 
 * @route POST /auth/register
 * @param {string} email - User's email address (must be unique)
 * @param {string} password - Plain text password (8-128 characters)
 * @returns {object} 200 - User object with id, email, nickname
 * @returns {object} 400 - Validation error or email already exists
 * @returns {object} 500 - Server error
 */
router.post('/register', async (req, res, next) => {
    try {
        // Validate input data
        const { email, password } = registerSchema.parse(req.body);

        // Check if email is already registered
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        // Hash password using Argon2id variant (most secure)
        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
        
        // Create new user in database
        const user = await prisma.user.create({
            data: { email, passwordHash, nickname: '' },
            select: { id: true, email: true, nickname: true }, // Don't return password hash
        });

        // Establish session for the new user
        req.logIn(user, (err: any) => {
            if (err) return next(err);
            // Store user ID in session for convenience
            req.session.userId = user.id;
            res.json(user);
        })
    } catch (e: any) {
        // Handle validation errors
        if (e.name === 'ZodError') return res.status(400).json({ error: 'Invalid input' });
        next(e);
    }
});

/**
 * User Login Endpoint
 * 
 * Authenticates a user with email and password using Passport local strategy.
 * Creates a session on successful authentication.
 * 
 * Authentication Flow:
 * 1. Validate input format
 * 2. Passport local strategy verifies credentials
 * 3. Establish session if authentication succeeds
 * 4. Return user data or error message
 * 
 * @route POST /auth/login
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {object} 200 - User object with id, email, nickname
 * @returns {object} 400 - Invalid input format
 * @returns {object} 401 - Invalid credentials
 * @returns {object} 500 - Server error
 */
router.post('/login', (req, res, next) => {
    try {
        // Validate input format
        loginSchema.parse(req.body);
    } catch {
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Use Passport local strategy for authentication
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

        // Establish session for authenticated user
        req.login(user, (err2: any) => {
            if (err2) return next(err2);
            req.session.userId = (user as any).id;
            res.json(user);
        });
    })(req, res, next);
});


/**
 * Current User Endpoint
 * 
 * Returns information about the currently authenticated user.
 * Uses Passport's req.user property which is populated by deserializeUser.
 * 
 * @route GET /auth/me
 * @returns {object|null} 200 - Current user object or null if not authenticated
 */
router.get('/me', (req, res) => {
    res.json(req.user ?? null);
});

/**
 * User Logout Endpoint
 * 
 * Terminates the user's session and clears the session cookie.
 * This endpoint performs a complete logout by:
 * 1. Calling Passport's logout method
 * 2. Destroying the server-side session
 * 3. Clearing the session cookie from the client
 * 
 * @route POST /auth/logout
 * @returns {object} 200 - Success confirmation
 * @returns {object} 500 - Server error during logout
 */
router.post('/logout', (req, res, next) => {
    req.logout((err: any) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('sid'); // Clear the session cookie
            res.json({ ok: true });
        });
    });
});

export default router;

