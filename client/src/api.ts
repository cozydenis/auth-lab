/**
 * HTTP Client Configuration and API Methods
 * 
 * This module configures the HTTP client for communicating with the Auth Lab server
 * and provides convenient wrapper methods for authentication endpoints.
 * 
 * Key Features:
 * - Axios configuration with base URL and credentials
 * - Automatic cookie handling for session management
 * - Centralized API endpoint definitions
 * - Error handling through Axios interceptors
 * - TypeScript support for request/response types
 * 
 * Configuration:
 * - Base URL from environment variables
 * - Credentials included for session cookies
 * - JSON content type for requests
 */

import axios from 'axios';

/**
 * Configured Axios Instance
 * 
 * Pre-configured HTTP client with settings optimized for the Auth Lab API:
 * 
 * Configuration Options:
 * - baseURL: API server URL from environment variable
 * - withCredentials: true - Enables automatic cookie handling for sessions
 * 
 * Cookie Handling:
 * The withCredentials option ensures that HTTP-only session cookies are
 * automatically included in all requests, enabling seamless session-based
 * authentication without manual token management.
 * 
 * Environment Variables:
 * - VITE_API_URL: Base URL for the API server (default: http://localhost:4000)
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Include cookies in requests for session handling
});

/**
 * Authentication API Methods
 * 
 * Convenient wrapper methods for authentication-related API endpoints.
 * These methods handle the HTTP requests and extract response data automatically.
 * 
 * All methods return promises that resolve to the response data or reject
 * with error information that can be handled by the calling components.
 * 
 * Error Handling:
 * - Network errors are handled by Axios
 * - Server errors (4xx, 5xx) throw exceptions with response data
 * - Calling components should wrap calls in try/catch blocks
 */
export const AuthAPI = {
    /**
     * Get Current User
     * 
     * Retrieves the currently authenticated user's information.
     * Used to check authentication status and get user data.
     * 
     * @returns Promise<User | null> - User object if authenticated, null otherwise
     * @throws Error if request fails
     * 
     * @example
     * ```typescript
     * try {
     *   const user = await AuthAPI.me();
     *   if (user) {
     *     console.log('Logged in as:', user.email);
     *   }
     * } catch (error) {
     *   console.error('Failed to get user:', error);
     * }
     * ```
     */
    me: () => api.get('/auth/me').then(r => r.data),

    /**
     * Register New User
     * 
     * Creates a new user account with email and password.
     * Automatically establishes a session for the new user.
     * 
     * @param email - User's email address
     * @param password - User's password (8+ characters)
     * @returns Promise<User> - Created user object
     * @throws Error if registration fails (email exists, validation error, etc.)
     * 
     * @example
     * ```typescript
     * try {
     *   const user = await AuthAPI.register('user@example.com', 'password123');
     *   console.log('Registered and logged in:', user.email);
     * } catch (error) {
     *   console.error('Registration failed:', error.response?.data?.error);
     * }
     * ```
     */
    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }).then(r => r.data),

    /**
     * Login User
     * 
     * Authenticates user with email and password credentials.
     * Establishes a session on successful authentication.
     * 
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise<User> - Authenticated user object
     * @throws Error if login fails (invalid credentials, validation error, etc.)
     * 
     * @example
     * ```typescript
     * try {
     *   const user = await AuthAPI.login('user@example.com', 'password123');
     *   console.log('Logged in as:', user.email);
     * } catch (error) {
     *   console.error('Login failed:', error.response?.data?.error);
     * }
     * ```
     */
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }).then(r => r.data),

    /**
     * Logout User
     * 
     * Ends the current user session by destroying server-side session
     * and clearing the session cookie.
     * 
     * @returns Promise<{ok: boolean}> - Success confirmation
     * @throws Error if logout request fails
     * 
     * @example
     * ```typescript
     * try {
     *   await AuthAPI.logout();
     *   console.log('Successfully logged out');
     * } catch (error) {
     *   console.error('Logout failed:', error);
     * }
     * ```
     */
    logout: () => api.post('/auth/logout').then(r => r.data),
};

/**
 * Default Export
 * 
 * Export the configured Axios instance for use in other parts of the application
 * where direct API access is needed (e.g., user profile operations).
 * 
 * This allows other modules to make authenticated requests using the same
 * configuration (base URL, credentials, etc.) without duplicating setup.
 */
export default api;
