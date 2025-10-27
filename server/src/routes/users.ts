/**
 * User Profile Management Routes
 * 
 * This module handles user profile operations that require authentication.
 * It provides endpoints for reading and updating user-specific data with
 * proper authorization checks.
 * 
 * Security Features:
 * - Authentication required for all routes
 * - Authorization checks ensure users can only access their own data
 * - Input validation using Zod schemas
 * - Proper HTTP status codes for different error conditions
 * 
 * Routes:
 * - GET /api/users/:id/nickname - Get user's nickname (owner only)
 * - PUT /api/users/:id/nickname - Update user's nickname (owner only)
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import { nicknameSchema } from '../validators';

const router = Router();

/**
 * Authentication Middleware
 * 
 * Ensures that a user is logged in before accessing protected routes.
 * This middleware checks for the presence of req.user which is populated
 * by Passport's deserializeUser function when a valid session exists.
 * 
 * @param req - Express request object
 * @param res - Express response object  
 * @param next - Express next function
 * @returns 401 Unauthorized if no user in session, otherwise continues
 */
function requireAuth(req: any, res: any, next: any) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
}

/**
 * Get User Nickname Endpoint
 * 
 * Retrieves the nickname for a specific user. Only the user themselves
 * can access their own nickname (owner-only access).
 * 
 * Authorization Logic:
 * - User must be authenticated (checked by requireAuth middleware)
 * - User can only access their own nickname (user ID must match URL parameter)
 * 
 * @route GET /api/users/:id/nickname
 * @param {number} id - User ID in URL parameter
 * @returns {object} 200 - Object containing the user's nickname
 * @returns {object} 401 - User not authenticated
 * @returns {object} 403 - User trying to access another user's data
 * @returns {object} 500 - Server error
 */
router.get('/:id/nickname', requireAuth, async (req: any, res) => {
    const targetId = Number(req.params.id);

    // Authorization check: users can only access their own data
    if (req.user.id !== targetId) return res.status(403).json({ error: 'Forbidden' });

    const user = await prisma.user.findUnique({ 
        where: { id: targetId }, 
        select: { nickname: true } 
    });
    res.json({ nickname: user?.nickname ?? '' });
})

/**
 * Update User Nickname Endpoint
 * 
 * Allows a user to update their own nickname. The nickname is validated
 * using a Zod schema and only the user themselves can update it.
 * 
 * Authorization Logic:
 * - User must be authenticated (checked by requireAuth middleware)
 * - User can only update their own nickname (user ID must match URL parameter)
 * 
 * Validation:
 * - Nickname is trimmed and limited to 50 characters
 * - Empty strings are allowed (user can clear their nickname)
 * 
 * @route PUT /api/users/:id/nickname
 * @param {number} id - User ID in URL parameter
 * @param {string} nickname - New nickname in request body
 * @returns {object} 200 - Object containing the updated nickname
 * @returns {object} 400 - Invalid input format
 * @returns {object} 401 - User not authenticated
 * @returns {object} 403 - User trying to update another user's data
 * @returns {object} 500 - Server error
 */
router.put('/:id/nickname', requireAuth, async (req: any, res) => {
    const targetId = Number(req.params.id);
    
    // Authorization check: users can only update their own data
    if (req.user.id !== targetId) return res.status(403).json({ error: 'Forbidden' });

    try {
        // Validate input using Zod schema
        const { nickname } = nicknameSchema.parse(req.body);
        
        // Update nickname in database
        const user = await prisma.user.update({
            where: { id: targetId },
            data: { nickname },
            select: { nickname: true },
        });
        res.json({ nickname: user.nickname });
    } catch {
        res.status(400).json({ error: 'Invalid input' });
    }
});

export default router;