import { useState } from 'react';
import { useAuth } from '../auth';

export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await register(email, password);
        } catch (e: any) {
            setErr(e?.response?.data?.error || 'Error');
        }
    };

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <h2>Register</h2>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Create account</button>
            {err && <p style={{ color: 'crimson' }}>{err}</p>}
        </form>
    );
}
