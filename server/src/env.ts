import 'dotenv/config';

function required(name: string): string {
    const v = process.env[name];

    if (!v) throw new Error(`Missing env var ${name}`);
    return v;
}

export const ENV = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    SESSION_SECRET: required('SESSION_SECRET'),
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};