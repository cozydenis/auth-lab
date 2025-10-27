/**
 * Main Application Component
 * 
 * This is the root component that sets up the application's routing, authentication,
 * and overall layout structure. It provides the foundation for the entire application
 * including navigation, route protection, and authentication state management.
 * 
 * Key Features:
 * - React Router for client-side routing
 * - Authentication context provider
 * - Global navigation component
 * - Protected route wrapper for authentication
 * - Responsive layout structure
 * 
 * Architecture:
 * - AuthProvider wraps the entire app for authentication state
 * - BrowserRouter enables client-side routing
 * - Nav component provides consistent navigation
 * - Protected wrapper secures authenticated routes
 */

import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import type { JSX } from 'react';

/**
 * Navigation Component
 * 
 * Provides consistent navigation across the application with authentication-aware
 * user status display. Shows current user email when logged in.
 * 
 * Features:
 * - Links to all main application pages
 * - User status indicator (email or "Not logged in")
 * - Responsive flexbox layout
 * - Visual separation with border
 * 
 * @returns JSX navigation bar with links and user status
 */
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

/**
 * Home Page Component
 * 
 * Simple landing page that welcomes users and provides guidance on using the app.
 * Serves as the default route and entry point for new users.
 * 
 * @returns JSX welcome message with usage instructions
 */
function Home() {
  return <div style={{ padding: 12 }}>Welcome. Try Register → then Profile.</div>;
}

/**
 * Protected Route Wrapper Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Handles the authentication check flow and appropriate redirects.
 * 
 * Authentication Flow:
 * 1. Shows loading spinner while checking authentication status
 * 2. Redirects to login page if user is not authenticated
 * 3. Renders protected content if user is authenticated
 * 
 * The redirect uses `replace` to avoid adding login page to history,
 * allowing proper back navigation after login.
 * 
 * @param children - The protected component to render if authenticated
 * @returns Loading spinner, login redirect, or protected content
 */
function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Main App Component
 * 
 * Sets up the complete application structure with authentication and routing.
 * This component orchestrates the entire application flow.
 * 
 * Component Hierarchy:
 * 1. AuthProvider - Provides authentication state to entire app
 * 2. BrowserRouter - Enables client-side routing
 * 3. Nav - Global navigation component
 * 4. Routes - Route definitions and components
 * 
 * Route Configuration:
 * - "/" - Public home page
 * - "/login" - Public login page
 * - "/register" - Public registration page
 * - "/profile" - Protected profile page (requires authentication)
 * 
 * @returns Complete application with routing and authentication
 */
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
