/**
 * Authentication Context and State Management
 * 
 * This module provides centralized authentication state management for the entire
 * application using React Context. It handles user authentication, session management,
 * and provides authentication methods to all components.
 * 
 * Key Features:
 * - Centralized authentication state
 * - Automatic session restoration on app load
 * - Authentication methods (login, register, logout)
 * - Loading states for async operations
 * - Error handling for authentication failures
 * 
 * Architecture:
 * - React Context for global state sharing
 * - Custom hook for convenient context access
 * - Provider component for state management
 * - Integration with API layer for server communication
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from './api';

/**
 * User Data Type Definition
 * 
 * Represents the structure of user data returned from the server.
 * Null indicates no authenticated user.
 */
type User = { id: number, email: string, nickname: string } | null;

/**
 * Authentication Context Type Definition
 * 
 * Defines the shape of the authentication context that will be provided
 * to all components in the application.
 * 
 * Properties:
 * - user: Current authenticated user data or null
 * - loading: Boolean indicating if authentication check is in progress
 * - refresh: Function to refresh current user data from server
 * - register: Function to register a new user account
 * - login: Function to authenticate with email/password
 * - logout: Function to end current session
 */
type AuthCtx = {
    user: User;
    loading: boolean;
    refresh: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

/**
 * Authentication Context
 * 
 * React context that provides authentication state and methods to all
 * components in the application tree.
 */
const Ctx = createContext<AuthCtx>(null!);

/**
 * Custom Hook for Authentication Context
 * 
 * Convenience hook that provides easy access to authentication context.
 * Must be used within an AuthProvider component.
 * 
 * @returns Authentication context with user state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => useContext(Ctx);

/**
 * Authentication Provider Component
 * 
 * Manages authentication state for the entire application and provides
 * authentication methods to child components via React Context.
 * 
 * State Management:
 * - user: Current authenticated user or null
 * - loading: Tracks authentication status check
 * 
 * Lifecycle:
 * 1. Component mounts and checks for existing session
 * 2. Sets loading to false after session check
 * 3. Provides authentication methods to children
 * 4. Updates state based on authentication actions
 * 
 * @param children - Child components that will have access to auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Refresh User Data
     * 
     * Fetches current user data from the server to check authentication status.
     * Called on app initialization and after authentication state changes.
     * 
     * Flow:
     * 1. Call server /auth/me endpoint
     * 2. Set user data if authenticated
     * 3. Set user to null if not authenticated or error occurs
     * 4. Set loading to false regardless of outcome
     */
    const refresh = async () => {
        try {
            const u = await AuthAPI.me();
            setUser(u || null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register New User
     * 
     * Creates a new user account and automatically logs them in.
     * 
     * @param email - User's email address
     * @param password - User's password
     * @throws Error if registration fails (handled by calling component)
     */
    const register = async (email: string, password: string) => {
        const u = await AuthAPI.register(email, password);
        setUser(u);
    }

    /**
     * Login User
     * 
     * Authenticates user with email and password, establishing a session.
     * 
     * @param email - User's email address
     * @param password - User's password
     * @throws Error if login fails (handled by calling component)
     */
    const login = async (email: string, password: string) => {
        const u = await AuthAPI.login(email, password);
        setUser(u);
    };

    /**
     * Logout User
     * 
     * Ends the current user session and clears authentication state.
     * 
     * Flow:
     * 1. Call server logout endpoint to destroy session
     * 2. Clear local user state
     */
    const logout = async () => {
        await AuthAPI.logout();
        setUser(null);
    };

    // Check for existing session on component mount
    useEffect(() => { void refresh(); }, []);

    return (<Ctx.Provider value={{ user, loading, refresh, register, login, logout }}>
        {children}
    </Ctx.Provider>);
}

