import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Start the OAUTH Dance
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}))

// Callback after google authenticates the user
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        // At this point, req.user is set and session established
        // Redirect back to your client (or show a small JSON)
        const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
        res.redirect(origin);
    }
)

// Optional: failure endpoint
router.get('/failure', (_req, res) => res.status(401).json({ error: 'Google auth failed' }));

export default router;