import passport from 'passport';
import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const nicknameSchema = z.object({
    nickname: z.string().trim().max(50),
});
