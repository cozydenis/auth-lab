import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import api from '../api';

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await api.get(`/api/users/${user.id}/nickname`);
      setNickname(data.nickname || '');
    })();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user)   return <p>Not logged in</p>;

  const save = async () => {
    try {
      const { data } = await api.put(`/api/users/${user.id}/nickname`, { nickname });
      setNickname(data.nickname);
      setMsg('Saved!');
      setTimeout(() => setMsg(null), 1200);
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Error');
    }
  };

  return (
    <div style={{ display:'grid', gap: 8, maxWidth: 360 }}>
      <h2>Profile</h2>
      <div>Email: {user.email}</div>
      <label>
        Nickname
        <input value={nickname} onChange={e => setNickname(e.target.value)} />
      </label>
      <div style={{ display:'flex', gap: 8 }}>
        <button onClick={save}>Save</button>
        <button onClick={logout}>Logout</button>
      </div>
      {msg && <p>{msg}</p>}
    </div>
  );
}
