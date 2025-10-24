import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from './passport'; 
import userRoutes from './routes/users';  
import { prisma } from './prisma';
import { ENV } from './env';
import authRoutes from './routes/auth';
import oauthGoogleRoutes from './routes/oauth-google';
import cors from 'cors';




const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

/**
 * SESSION MIDDLEWARE
 * - cookie is HttpOnly → JS cannot read it (mitigates XSS token theft)
 * - SameSite=Lax → stops most CSRF on simple navigations by default
 * - secure=false locally (no TLS). In prod behind HTTPS set to true.
 * - name='sid' → custom cookie name (default is 'connect.sid')
 * - resave/saveUninitialized are tuned for typical login sessions
 *
 * NOTE: MemoryStore is fine for local dev. For prod, use Redis or a DB store.
 */
app.use(
    session({
        name: 'sid',
        secret: ENV.SESSION_SECRET,     // used to sign the cookie
        resave: false,                  // don’t resave if unmodified
        saveUninitialized: false,       // don’t create empty sessions
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,                // set true when you run behind HTTPS
            maxAge: 1000 * 60 * 60,       // 1 hour
        },
    })
);

app.get('/health', (_req, res) => res.json({ ok: true }));
/**
 * /debug/users just confirms Prisma is wired.
 */
app.get('/debug/users', async (_req, res) => {
    const users = await prisma.user.findMany({ take: 5 });
    res.json(users);
});

/**
 * /debug/session proves that sessions persist.
 * It stores a counter in server-side session storage,
 * identified by the signed cookie we set on first response.
 */
app.get('/debug/session', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    res.json({ message: 'Session alive', views: req.session.views, userId: req.session.userId ?? null });
});
// initialize passport (must come after session middleware)
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/users', userRoutes);
// Auth routes
app.use('/auth', authRoutes);
app.use('/auth', oauthGoogleRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });

});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // "http://localhost:5173"
  credentials: true,                 // allow sending cookies
}));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));


