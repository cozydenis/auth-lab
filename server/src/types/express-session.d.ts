import 'express-session';

declare module 'express-session' {
    interface SessionData {
        views?: number;      // ← add whatever keys you store in req.session
        userId?: number;     // ← we’ll use this later for logged-in user IDs
    }
}
