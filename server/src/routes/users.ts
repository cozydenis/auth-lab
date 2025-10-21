import { Router } from 'express';
import { prisma } from '../prisma';
import { nicknameSchema } from '../validators';

const router = Router();

/**
 * Require that a user is logged in.
 * Attach this to any route that needs authentication.
 */
function requireAuth(req: any, res: any, next: any) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
}

/**
 * GET /api/users/:id/nickname
 * - Only the owner can read their nickname
 */
router.get('/:id/nickname', requireAuth, async (req: any, res) => {
    const targetId = Number(req.params.id);

    if (req.user.id !== targetId) return res.status(403).json({ error: 'Forbidden' });

    const user = await prisma.user.findUnique({ where: { id: targetId }, select: { nickname: true } });
    res.json({ nickname: user?.nickname ?? '' });
})

/**
 * PUT /api/users/:id/nickname
 * - Only the owner can update their nickname
 * - Validates input with Zod
 */
router.put('/:id/nickname', requireAuth, async (req: any, res) => {
    const targetId = Number(req.params.id);
    if (req.user.id !== targetId) return res.status(403).json({ error: 'Forbidden' });

    try {
        const { nickname } = nicknameSchema.parse(req.body);
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