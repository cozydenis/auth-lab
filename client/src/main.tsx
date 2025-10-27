/**
 * Application Entry Point
 * 
 * This file is the entry point for the React application. It sets up the React DOM
 * rendering with StrictMode enabled for development warnings and future compatibility.
 * 
 * Key Features:
 * - React 19 createRoot API for concurrent rendering
 * - StrictMode for development checks and future React features
 * - TypeScript support with proper type checking
 * - Global CSS imports for styling
 * 
 * Flow:
 * 1. Import necessary React modules and components
 * 2. Import global styles
 * 3. Create React root and render App component
 * 4. Wrap in StrictMode for development benefits
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Initialize and render the React application
 * 
 * Uses React 19's createRoot API for:
 * - Concurrent rendering capabilities
 * - Automatic batching of state updates
 * - Better error boundaries
 * - Future React features compatibility
 * 
 * StrictMode provides:
 * - Double-rendering in development to catch side effects
 * - Warnings about deprecated APIs
 * - Detection of unsafe lifecycles
 * - Preparation for future React features
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
