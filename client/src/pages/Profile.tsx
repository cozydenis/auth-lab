/**
 * User Profile Management Page Component
 * 
 * Protected page that allows authenticated users to view and manage their profile
 * information. Provides nickname editing functionality and account management options.
 * 
 * Key Features:
 * - Display user email and current nickname
 * - Edit and save nickname with server synchronization
 * - Logout functionality
 * - Loading states for async operations
 * - Error handling for profile operations
 * - Real-time feedback for save operations
 * 
 * Authentication:
 * - This component is protected by the Protected wrapper in App.tsx
 * - Users must be authenticated to access this page
 * - Automatic redirect to login if session expires
 * 
 * Data Flow:
 * 1. Component loads current user data from auth context
 * 2. Fetches current nickname from server
 * 3. Allows editing and saving nickname updates
 * 4. Provides logout functionality
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import api from '../api';

/**
 * Profile Management Component
 * 
 * Authenticated user profile page with nickname editing and account management.
 * 
 * Component State:
 * - nickname: Current nickname value being edited
 * - msg: Feedback message for user actions (save confirmation, errors)
 * 
 * Authentication State (from context):
 * - user: Current authenticated user data
 * - loading: Authentication status check
 * - logout: Function to end current session
 * 
 * @returns JSX profile interface with user info and management options
 */
export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  /**
   * Load User Nickname on Component Mount
   * 
   * Fetches the current nickname from the server when the component loads
   * or when the user changes (e.g., after login).
   * 
   * Flow:
   * 1. Check if user is available from auth context
   * 2. Make API request to get current nickname
   * 3. Update local state with fetched nickname
   * 4. Handle empty nickname gracefully
   * 
   * Dependencies: [user] - Re-run when user changes
   */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await api.get(`/api/users/${user.id}/nickname`);
        setNickname(data.nickname || '');
      } catch (error) {
        console.error('Failed to load nickname:', error);
        setMsg('Failed to load nickname');
      }
    })();
  }, [user]);

  // Loading state while authentication is being checked
  if (loading) return <p>Loading...</p>;
  
  // Safety check - should not happen due to Protected wrapper
  if (!user) return <p>Not logged in</p>;

  /**
   * Save Nickname Changes
   * 
   * Updates the user's nickname on the server and provides user feedback.
   * 
   * Save Flow:
   * 1. Send PUT request to server with new nickname
   * 2. Update local state with server response
   * 3. Show success message to user
   * 4. Auto-hide message after 1.2 seconds
   * 5. Handle and display any errors
   * 
   * User Feedback:
   * - Success: "Saved!" message in default color
   * - Error: Error message in crimson color
   * - Messages automatically clear after timeout
   * 
   * Error Handling:
   * - Network errors from Axios
   * - Server validation errors (nickname too long, etc.)
   * - Generic fallback error message
   */
  const save = async () => {
    try {
      const { data } = await api.put(`/api/users/${user.id}/nickname`, { nickname });
      setNickname(data.nickname);
      setMsg('Saved!');
      setTimeout(() => setMsg(null), 1200);
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Error');
      setTimeout(() => setMsg(null), 3000); // Keep error message longer
    }
  };

  /**
   * Render Profile Management Interface
   * 
   * Creates a responsive profile management interface with:
   * - User email display (read-only)
   * - Nickname input field with real-time editing
   * - Save button for nickname changes
   * - Logout button for session management
   * - Feedback message display
   * 
   * Layout:
   * - CSS Grid for consistent vertical spacing
   * - Maximum width for mobile-friendly design
   * - Flexbox for button row layout
   * 
   * Interaction:
   * - Real-time nickname editing with controlled input
   * - Immediate feedback for save operations
   * - Logout redirects to login page via auth context
   * 
   * Accessibility:
   * - Proper form labels for nickname input
   * - Clear visual hierarchy with headings
   * - Semantic HTML structure
   */
  return (
    <div style={{ display:'grid', gap: 8, maxWidth: 360 }}>
      <h2>Profile</h2>
      <div>Email: {user.email}</div>
      <label>
        Nickname
        <input 
          value={nickname} 
          onChange={e => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          maxLength={50}
        />
      </label>
      <div style={{ display:'flex', gap: 8 }}>
        <button onClick={save}>Save</button>
        <button onClick={logout}>Logout</button>
      </div>
      {msg && <p style={{ color: msg === 'Saved!' ? 'green' : 'crimson' }}>{msg}</p>}
    </div>
  );
}
