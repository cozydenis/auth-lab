/**
 * Login Page Component
 * 
 * Provides user authentication interface with both local email/password login
 * and Google OAuth integration. Handles form submission, error display, and
 * OAuth redirect flow.
 * 
 * Key Features:
 * - Email/password form with validation
 * - Google OAuth login button
 * - Error handling and display
 * - Form state management
 * - Responsive design
 * 
 * Authentication Methods:
 * 1. Local: Email/password sent to server via AuthAPI
 * 2. OAuth: Browser redirect to server's Google OAuth endpoint
 * 
 * Error Handling:
 * - Network errors from Axios
 * - Validation errors from server
 * - Generic fallback error messages
 */

import { useState } from 'react';
import { useAuth } from '../auth';

/**
 * Login Page Component
 * 
 * User authentication page with local and OAuth login options.
 * 
 * Component State:
 * - email: User's email input
 * - password: User's password input  
 * - err: Error message to display to user
 * 
 * @returns JSX login form with email/password fields and OAuth button
 */
export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    /**
     * Handle Local Login Form Submission
     * 
     * Processes email/password login attempt with error handling.
     * 
     * Flow:
     * 1. Prevent default form submission
     * 2. Clear any existing error messages
     * 3. Attempt login via authentication context
     * 4. Display error message if login fails
     * 
     * Error Handling:
     * - Extracts error message from server response
     * - Falls back to generic "Error" message
     * - Displays error below form for user feedback
     * 
     * @param e - Form submission event
     */
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await login(email, password);
        } catch (e: any) {
            setErr(e?.response?.data?.error || 'Error');
        }
    };

    /**
     * Handle Google OAuth Login
     * 
     * Initiates Google OAuth flow by redirecting browser to server's
     * Google authentication endpoint.
     * 
     * OAuth Flow:
     * 1. Browser navigates to server's /auth/google endpoint
     * 2. Server redirects to Google consent screen
     * 3. User grants permission to Google
     * 4. Google redirects back to server callback
     * 5. Server establishes session and redirects to client
     * 6. Client detects authentication and updates state
     * 
     * The window.location.href approach is used because OAuth requires
     * a full page navigation to handle the redirect flow properly.
     */
    const google = () => {
        // Navigate browser to server's Google OAuth endpoint
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    /**
     * Render Login Form
     * 
     * Creates a responsive login form with:
     * - Email input field
     * - Password input field  
     * - Local login submit button
     * - Google OAuth login button
     * - Error message display
     * 
     * Styling:
     * - CSS Grid layout for consistent spacing
     * - Maximum width for mobile-friendly design
     * - Error messages in crimson color for visibility
     */
    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <h2>Login</h2>
            <input 
                placeholder="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email"
                required
            />
            <input 
                placeholder="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required 
            />
            <button type="submit">Login</button>
            <button type="button" onClick={google}>Login with Google</button>
            {err && <p style={{ color: 'crimson' }}>{err}</p>}
        </form>
    );
}
