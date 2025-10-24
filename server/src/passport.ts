import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
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

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,       // load from env
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },

    /**
     * Google returns a profile; we create (or link) a local user record.
     * Merging by email avoids duplicate accounts when a user first registered locally.
     */
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
            const provider = 'google';
            const providerId = profile.id;
            const email = profile.emails?.[0]?.value;

            if(!email) return done(null, false, {message: 'No e-mail found from provider'})

            //Check in the db if we already have providerId
            let user = await prisma.user.findFirst({ where: {provider, providerId} });
            
            // First time logging in via OAUTH
            if(!user){
                user = await prisma.user.upsert({
                    where: {email}, // If email already has an account --> Link it
                    update: {provider, providerId},
                    create: {email, provider, providerId, nickname: '' },
                    select: {id: true, email: true, nickname: true},
                });

            }

            return done(null, user)
        } catch (e) {
            return done(e as any);
        }


    }

));

export default passport;