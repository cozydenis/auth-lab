/**
 * User Registration Page Component
 * 
 * Provides user registration interface for creating new accounts with email
 * and password. Handles form submission, validation, error display, and
 * automatic login after successful registration.
 * 
 * Key Features:
 * - Email/password registration form
 * - Client-side form validation
 * - Server-side validation error handling
 * - Automatic login after registration
 * - Responsive design with error display
 * 
 * Registration Flow:
 * 1. User enters email and password
 * 2. Form validates input requirements
 * 3. Registration request sent to server
 * 4. Server creates account and establishes session
 * 5. User automatically logged in and redirected
 * 
 * Error Handling:
 * - Email already exists
 * - Password validation failures
 * - Network errors
 * - Server validation errors
 */

import { useState } from 'react';
import { useAuth } from '../auth';

/**
 * Registration Page Component
 * 
 * User account creation page with email and password registration.
 * 
 * Component State:
 * - email: User's email input
 * - password: User's password input
 * - err: Error message to display to user
 * 
 * @returns JSX registration form with input validation and error handling
 */
export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    /**
     * Handle Registration Form Submission
     * 
     * Processes user registration with comprehensive error handling.
     * 
     * Registration Flow:
     * 1. Prevent default form submission behavior
     * 2. Clear any existing error messages
     * 3. Attempt account creation via authentication context
     * 4. Handle success (automatic login) or display errors
     * 
     * Error Handling:
     * - Server validation errors (email format, password requirements)
     * - Email already exists error
     * - Network connectivity issues
     * - Generic server errors
     * 
     * Success Behavior:
     * - User account created and session established
     * - Authentication context updated with new user
     * - User automatically redirected to protected routes
     * 
     * @param e - Form submission event
     */
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await register(email, password);
            // Success: User is automatically logged in by auth context
        } catch (e: any) {
            // Extract and display error message from server response
            setErr(e?.response?.data?.error || 'Error');
        }
    };

    /**
     * Render Registration Form
     * 
     * Creates a responsive registration form with:
     * - Email input with validation
     * - Password input with security requirements
     * - Submit button for account creation
     * - Error message display
     * 
     * Form Validation:
     * - Email field has type="email" for browser validation
     * - Password field has minimum length requirements
     * - Both fields are required
     * 
     * Styling:
     * - CSS Grid layout for consistent spacing
     * - Maximum width for mobile-friendly design
     * - Error messages in crimson color for visibility
     * 
     * Accessibility:
     * - Proper form labels via placeholder text
     * - Required field indicators
     * - Semantic HTML elements
     */
    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <h2>Register</h2>
            <input 
                placeholder="email" 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input 
                placeholder="password (8+ characters)" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                required
            />
            <button type="submit">Create account</button>
            {err && <p style={{ color: 'crimson' }}>{err}</p>}
        </form>
    );
}
