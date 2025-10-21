import { Router } from 'express';
import passport from 'passport';
import argon2 from 'argon2';
import { prisma } from '../prisma';
import { loginSchema, registerSchema } from '../validators';

const router = Router();

/**
 * POST /auth/register
 * - validate input
 * - hash password with argon2id
 * - create user
 * - establish a session (req.login)
 */

router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
        const user = await prisma.user.create({
            data: { email, passwordHash, nickname: '' },
            select: { id: true, email: true, nickname: true },
        });

        // establish a connection
        req.logIn(user, (err: any) => {
            if (err) return next(err);
            // set convenience field too (not required but handy for debug)
            req.session.userId = user.id;
            res.json(user);
        })
    } catch (e: any) {
        if (e.name === 'ZodError') return res.status(400).json({ error: 'Invalid input' });
        next(e);
    }
});

/**
 * POST /auth/login
 * - validates input
 * - runs passport local strategy (creates session on success)
 */
router.post('/login', (req, res, next) => {
    try {
        loginSchema.parse(req.body);
    } catch {
        return res.status(400).json({ error: 'Invalid input' });
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

        req.login(user, (err2: any) => {
            if (err2) return next(err2);
            req.session.userId = (user as any).id;
            res.json(user);
        });
    })(req, res, next);
});


/** GET /auth/me — returns current session user, or null */
router.get('/me', (req, res) => {
    res.json(req.user ?? null);
});

/** POST /auth/logout — destroys server-side session and clears cookie */
router.post('/logout', (req, res, next) => {
    req.logout((err: any) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('sid');
            res.json({ ok: true });
        });
    });
});

export default router;

