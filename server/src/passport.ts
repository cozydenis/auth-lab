/**
 * Passport Authentication Configuration
 * 
 * This module configures Passport.js authentication strategies for the application.
 * It sets up both local email/password authentication and Google OAuth integration,
 * along with session serialization/deserialization.
 * 
 * Supported Authentication Methods:
 * 1. Local Strategy: Email/password with Argon2 password hashing
 * 2. Google OAuth 2.0: Social login with automatic account linking
 * 
 * Security Features:
 * - Password hashing with Argon2 (memory-hard function)
 * - Session-based authentication (stateful)
 * - Account linking by email for OAuth users
 * - Generic error messages to prevent user enumeration
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import argon2 from 'argon2';
import { prisma } from './prisma';
import { email } from 'zod';

/**
 * SESSION SERIALIZATION
 * 
 * Determines what data is stored in the session cookie.
 * Only the user ID is stored to keep the session payload minimal.
 * This function is called when a user successfully authenticates.
 * 
 * @param user - The user object returned from authentication strategy
 * @param done - Callback function to complete serialization
 */
passport.serializeUser(async (user: any, done) => {
    done(null, user.id);
});

/**
 * SESSION DESERIALIZATION
 * 
 * Retrieves the full user object from the database using the ID stored in session.
 * This function is called on every request where a session exists.
 * Only essential user data is selected to minimize database load.
 * 
 * @param id - User ID from the session
 * @param done - Callback function with the user object or error
 */
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id},
            select: {id: true, email: true, nickname: true},
        });
        done(null, user);
    } catch (e) {
        done(e);
    }
});

/**
 * LOCAL AUTHENTICATION STRATEGY
 * 
 * Handles email/password authentication using the Passport Local Strategy.
 * Passwords are securely hashed using Argon2, a memory-hard function
 * resistant to both brute-force and rainbow table attacks.
 * 
 * Security Features:
 * - Argon2 password hashing (more secure than bcrypt)
 * - Generic error messages prevent user enumeration
 * - Timing-safe password verification
 * 
 * Configuration:
 * - usernameField: 'email' - Use email instead of username
 * - passwordField: 'password' - Standard password field
 * - session: true - Enable session-based authentication
 * 
 * @param email - User's email address
 * @param password - Plain text password from login form
 * @param done - Passport callback function
 */
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password', session: true},
        async (email, password, done) => {
            try {
                // Find user by email
                const user = await prisma.user.findUnique({ where:  { email } });
                
                // Check if user exists and has a password hash (not OAuth-only)
                if (!user || !user.passwordHash) {
                    return done(null, false, { message: 'Invalid Credentials'}); // Generic response
                }
                
                // Verify password using Argon2
                const ok = argon2.verify(user.passwordHash, password);
                if (!ok) {
                    return done(null, false, { message: 'Invalid Credentials'});
                }
                
                // Authentication successful - return user data
                return done(null, { id: user.id, email: user.email, nickname: user.nickname });
            } catch(e) {
                return done(e)
            }
        }
    )
);

/**
 * GOOGLE OAUTH 2.0 STRATEGY
 * 
 * Handles Google OAuth authentication using the Passport Google OAuth20 Strategy.
 * This allows users to sign in with their Google accounts without creating
 * a separate password.
 * 
 * Account Linking Strategy:
 * - If OAuth user email matches existing local account → link accounts
 * - If new OAuth user → create new account with OAuth provider info
 * - If returning OAuth user → authenticate existing account
 * 
 * Configuration requires Google Cloud Console setup:
 * - GOOGLE_CLIENT_ID: OAuth 2.0 client ID
 * - GOOGLE_CLIENT_SECRET: OAuth 2.0 client secret  
 * - GOOGLE_CALLBACK_URL: Authorized redirect URI
 * 
 * @param _accessToken - Google access token (not stored)
 * @param _refreshToken - Google refresh token (not stored)
 * @param profile - Google user profile information
 * @param done - Passport callback function
 */
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,       // OAuth client ID from Google Console
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // OAuth client secret
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,   // Authorized redirect URI
    },

    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
            const provider = 'google';
            const providerId = profile.id;
            const email = profile.emails?.[0]?.value;

            // Ensure we have an email from Google
            if(!email) return done(null, false, {message: 'No e-mail found from provider'})

            // Check if user already exists with this Google ID
            let user = await prisma.user.findFirst({ where: {provider, providerId} });
            
            // First time logging in via OAuth
            if(!user){
                // Use upsert to handle account linking by email
                user = await prisma.user.upsert({
                    where: {email},                    // Find existing account by email
                    update: {provider, providerId},    // Link Google account to existing account
                    create: {                          // Create new account if email doesn't exist
                        email, 
                        provider, 
                        providerId, 
                        nickname: '' 
                    },
                    select: {id: true, email: true, nickname: true}, // Return minimal user data
                });
            }

            return done(null, user)
        } catch (e) {
            return done(e as any);
        }
    }
));

export default passport;