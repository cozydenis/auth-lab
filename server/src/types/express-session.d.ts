/**
 * Express Session Type Extensions
 * 
 * This module extends the default Express session interface to include
 * custom properties that our application stores in the session.
 * 
 * TypeScript Declaration Merging:
 * The 'declare module' syntax merges our custom properties with the
 * existing SessionData interface from express-session, providing
 * type safety when accessing session properties.
 * 
 * Custom Session Properties:
 * - views: Counter for debugging session persistence
 * - userId: ID of the currently authenticated user
 */

import 'express-session';

declare module 'express-session' {
    interface SessionData {
        /**
         * View counter for session debugging.
         * Incremented each time /debug/session is accessed.
         * Used to verify session persistence across requests.
         */
        views?: number;
        
        /**
         * ID of the currently authenticated user.
         * Set when user logs in successfully via local or OAuth authentication.
         * Used for quick user identification and debugging.
         * Redundant with Passport's serialization but useful for development.
         */
        userId?: number;
    }
}
