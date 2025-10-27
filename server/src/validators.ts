/**
 * Input Validation Schemas
 * 
 * This module defines Zod schemas for validating user input across the application.
 * Zod provides runtime type validation and ensures data integrity before
 * processing requests or storing data in the database.
 * 
 * Benefits of Zod validation:
 * - Runtime type safety with TypeScript integration
 * - Automatic error messages for invalid input
 * - Parsing and transformation of input data
 * - Prevention of injection attacks through strict validation
 * - Clear validation rules that serve as documentation
 */

import passport from 'passport';
import { z } from 'zod';

/**
 * User Registration Validation Schema
 * 
 * Validates user registration input to ensure secure account creation.
 * 
 * Validation Rules:
 * - email: Must be a valid email format
 * - password: 8-128 characters (enforces minimum security while allowing passphrases)
 * 
 * Usage:
 * ```typescript
 * const { email, password } = registerSchema.parse(req.body);
 * ```
 */
export const registerSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password must not exceed 128 characters'),
});

/**
 * User Login Validation Schema
 * 
 * Validates user login credentials. Uses more relaxed validation
 * than registration since we want to accept any existing password.
 * 
 * Validation Rules:
 * - email: Must be a valid email format
 * - password: At least 1 character (existing passwords may not meet current requirements)
 * 
 * Usage:
 * ```typescript
 * const { email, password } = loginSchema.parse(req.body);
 * ```
 */
export const loginSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * Nickname Update Validation Schema
 * 
 * Validates user nickname updates for profile management.
 * 
 * Validation Rules:
 * - nickname: Trimmed string, maximum 50 characters
 * - Allows empty strings (users can clear their nickname)
 * 
 * Usage:
 * ```typescript
 * const { nickname } = nicknameSchema.parse(req.body);
 * ```
 */
export const nicknameSchema = z.object({
    nickname: z.string()
        .trim()
        .max(50, 'Nickname must not exceed 50 characters'),
});
