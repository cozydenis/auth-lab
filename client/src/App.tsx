import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import type { JSX } from 'react';

function Nav() {
  const { user } = useAuth();
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/profile">Profile</Link>
      <span style={{ marginLeft: 'auto' }}>{user ? `👤 ${user.email}` : 'Not logged in'}</span>
    </nav>
  );
}

function Home() {
  return <div style={{ padding: 12 }}>Welcome. Try Register → then Profile.</div>;
}

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <div style={{ padding: 12 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
