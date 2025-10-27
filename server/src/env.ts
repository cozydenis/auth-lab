/**
 * Environment Variable Configuration and Validation
 * 
 * This module centralizes environment variable access and validation.
 * It ensures required environment variables are present at startup
 * and provides type-safe access to configuration values.
 * 
 * Features:
 * - Automatic loading of .env files via dotenv
 * - Validation of required environment variables
 * - Type conversion (string to number for PORT)
 * - Default values for optional variables
 * - Centralized configuration access point
 */

import 'dotenv/config';

/**
 * Validates that a required environment variable is present and non-empty.
 * Throws an error with a descriptive message if the variable is missing.
 * 
 * @param name - The name of the environment variable to check
 * @returns The value of the environment variable
 * @throws Error if the environment variable is missing or empty
 */
function required(name: string): string {
    const v = process.env[name];

    if (!v) throw new Error(`Missing env var ${name}`);
    return v;
}

/**
 * Environment Configuration Object
 * 
 * Centralizes all environment-dependent configuration with validation.
 * This object is imported throughout the application for consistent
 * access to configuration values.
 * 
 * Configuration Variables:
 * - PORT: Server port number (default: 4000)
 * - SESSION_SECRET: Secret key for signing session cookies (required)
 * - CLIENT_ORIGIN: Allowed origin for CORS (default: localhost:5173)
 */
export const ENV = {
    /** Server port number, parsed from string to integer */
    PORT: parseInt(process.env.PORT || '4000', 10),
    
    /** Secret key for signing session cookies - must be provided */
    SESSION_SECRET: required('SESSION_SECRET'),
    
    /** Client origin for CORS configuration */
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};