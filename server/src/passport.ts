import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';
import { prisma } from './prisma';
import { email } from 'zod';


// What goes into the session cookie (tiny): just user id
passport.serializeUser(async (user: any, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id},
            select: {id: true, email: true, nickname: true},
        });
        done(null, user);
    } catch (e) {
        done(e);
    }
});

// email + password login using argon2 verify
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password', session: true},
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where:  { email } });
                if (!user || !user.passwordHash) {
                    return done(null, false, { message: 'Invalid Credentials'}); //generic response
                }
                const ok = argon2.verify(user.passwordHash, password);
                if (!ok) {
                    return done(null, false, { message: 'Invalid Credentials'});
                }
                return done(null, { id: user.id, email: user.email, nickname: user.nickname });
            } catch(e) {
                return done(e)

            }
        }
    )
);

export default passport;