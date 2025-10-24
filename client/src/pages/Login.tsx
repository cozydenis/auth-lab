import { useState } from 'react';
import { useAuth } from '../auth';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await login(email, password);
        } catch (e: any) {
            setErr(e?.response?.data?.error || 'Error');
        }
    };

    const google = () => {
        // this navigates the browser to your backend's Google route;
        // after the OAuth flow, your server redirects back (CLIENT_ORIGIN)
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <h2>Login</h2>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            <button type="button" onClick={google}>Login with Google</button>
            {err && <p style={{ color: 'crimson' }}>{err}</p>}
        </form>
    );
}
