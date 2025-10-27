/**
 * Google OAuth Authentication Routes
 * 
 * This module handles Google OAuth 2.0 authentication flow using Passport.js.
 * It provides endpoints for initiating OAuth flow and handling Google's callback.
 * 
 * OAuth Flow:
 * 1. User clicks "Login with Google" → GET /auth/google
 * 2. Redirect to Google consent screen
 * 3. User grants permission
 * 4. Google redirects to callback → GET /auth/google/callback
 * 5. Server exchanges code for user profile
 * 6. User account created/linked and session established
 * 7. Redirect back to client application
 * 
 * Configuration Requirements:
 * - Google Cloud Console project with OAuth 2.0 credentials
 * - Authorized redirect URI matching GOOGLE_CALLBACK_URL
 * - Environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 */

import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * Initiate Google OAuth Flow
 * 
 * Redirects the user to Google's OAuth consent screen where they can
 * grant permission for the application to access their profile and email.
 * 
 * Requested Scopes:
 * - email: Access to user's email address
 * - profile: Access to basic profile information (name, picture)
 * 
 * @route GET /auth/google
 * @redirects Google OAuth consent screen
 */
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}))

/**
 * Google OAuth Callback Handler
 * 
 * Handles the redirect from Google after user grants or denies permission.
 * This endpoint receives an authorization code from Google, exchanges it
 * for user profile information, and creates/links a user account.
 * 
 * Success Flow:
 * 1. Google redirects here with authorization code
 * 2. Passport exchanges code for user profile
 * 3. User account created or linked by email
 * 4. Session established with user
 * 5. Redirect to client application
 * 
 * Failure Flow:
 * - Redirects to /auth/failure if authentication fails
 * 
 * @route GET /auth/google/callback
 * @param {string} code - Authorization code from Google (in query params)
 * @redirects Client application on success, /auth/failure on error
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        // At this point, req.user is set and session established
        // Redirect back to client application
        const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
        res.redirect(origin);
    }
)

/**
 * OAuth Failure Endpoint
 * 
 * Handles cases where Google OAuth authentication fails.
 * This could happen if:
 * - User denies permission
 * - Invalid OAuth configuration
 * - Google service is unavailable
 * - Network errors during OAuth flow
 * 
 * @route GET /auth/failure
 * @returns {object} 401 - Error message indicating OAuth failure
 */
router.get('/failure', (_req, res) => res.status(401).json({ error: 'Google auth failed' }));

export default router;