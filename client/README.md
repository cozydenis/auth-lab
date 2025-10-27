# Auth Lab Client

A modern React frontend application built with TypeScript and Vite, providing user authentication and profile management. This client application works seamlessly with the Auth Lab server to offer both local email/password authentication and Google OAuth integration.

## Features

- 🔐 **Authentication**: Email/password login and registration
- 🌐 **OAuth Integration**: Google OAuth 2.0 login
- 👤 **Profile Management**: Update user nickname and manage account
- 🛡️ **Protected Routes**: Automatic redirection for unauthenticated access
- 🎨 **Modern UI**: Clean, responsive interface with React Router
- 🔄 **State Management**: React Context for authentication state
- 📡 **API Integration**: Axios for HTTP requests with automatic cookie handling
- ⚡ **Fast Development**: Vite for lightning-fast development experience

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Styling**: CSS-in-JS (inline styles for simplicity)
- **Development**: ESLint for code quality

## Project Structure

```
src/
├── main.tsx              # Application entry point and React DOM rendering
├── App.tsx               # Main app component with routing and layout
├── auth.tsx              # Authentication context and state management
├── api.ts                # HTTP client configuration and API methods
├── index.css             # Global styles
├── App.css               # Component-specific styles
├── pages/
│   ├── Login.tsx         # Login page with local and OAuth options
│   ├── Register.tsx      # User registration page
│   └── Profile.tsx       # User profile management page
└── assets/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Auth Lab server running on `http://localhost:4000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   
   The client uses `.env.development` for development environment variables:
   ```bash
   VITE_API_URL=http://localhost:4000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Application Flow

### Authentication Flow

1. **Registration**:
   - User enters email and password
   - Client validates input and sends to `/auth/register`
   - Server creates account and establishes session
   - User automatically logged in

2. **Login**:
   - Local: Email/password sent to `/auth/login`
   - OAuth: Redirect to `/auth/google` for OAuth flow
   - Session established on successful authentication
   - User redirected to intended page

3. **Session Management**:
   - Authentication state managed via React Context
   - Session cookies automatically included in requests
   - User data fetched from `/auth/me` on app load
   - Auto-logout on session expiration

### Route Protection

Protected routes automatically redirect unauthenticated users:

```tsx
<Route path="/profile" element={<Protected><Profile /></Protected>} />
```

The `Protected` component:
- Shows loading spinner during auth check
- Redirects to `/login` if not authenticated
- Renders children if authenticated

### API Integration

The client uses Axios with automatic session cookie handling:

```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Include cookies in requests
});
```

## Components Overview

### `main.tsx` - Application Entry
- Renders React app with StrictMode
- Mounts app to DOM root element

### `App.tsx` - Main Application
- Sets up React Router with authentication provider
- Defines application routes and navigation
- Implements protected route wrapper
- Provides global navigation bar

### `auth.tsx` - Authentication Context
- Centralized authentication state management
- Provides auth methods: login, register, logout
- Handles user session persistence
- Automatic session refresh on app load

### `api.ts` - HTTP Client
- Configured Axios instance with base URL
- Automatic cookie handling for sessions
- Authentication API wrapper methods
- Error handling for API responses

### Page Components

#### `Login.tsx`
- Email/password login form
- Google OAuth login button
- Error handling and display
- Form validation and submission

#### `Register.tsx`
- User registration form
- Input validation
- Error handling
- Automatic login after registration

#### `Profile.tsx`
- User profile display
- Nickname editing functionality
- Save/logout actions
- Loading and error states

## State Management

### Authentication State

The authentication context manages:

```typescript
type AuthCtx = {
    user: User | null;           // Current user data
    loading: boolean;            // Authentication check status
    refresh: () => Promise<void>; // Refresh user data
    register: (email, password) => Promise<void>;
    login: (email, password) => Promise<void>;
    logout: () => Promise<void>;
};
```

### User Data Structure

```typescript
type User = {
    id: number;
    email: string;
    nickname: string;
};
```

## Security Features

### Client-Side Security
- **Cookie-based Sessions**: Automatic session handling via HTTP-only cookies
- **Protected Routes**: Prevents unauthorized access to protected pages
- **Input Validation**: Form validation before API calls
- **Error Handling**: Safe error display without exposing sensitive data
- **HTTPS Ready**: Configured for secure connections in production

### Development vs Production
- **Development**: HTTP allowed for localhost
- **Production**: HTTPS required for security
- **Environment Variables**: Different API URLs per environment

## API Endpoints Used

The client communicates with these server endpoints:

### Authentication
- `GET /auth/me` - Get current user
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/logout` - Logout and clear session
- `GET /auth/google` - Initiate Google OAuth

### User Management
- `GET /api/users/:id/nickname` - Get user nickname
- `PUT /api/users/:id/nickname` - Update user nickname

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Handled by Axios interceptors
2. **Validation Errors**: Form validation before submission
3. **API Errors**: Server error messages displayed to user
4. **Authentication Errors**: Automatic redirect to login

### Error Display

Errors are displayed contextually:
- Form errors: Below form inputs
- API errors: Generic user-friendly messages
- Network errors: Connection status indicators

## Styling

The application uses inline styles for simplicity:

- **Responsive Design**: Flexible layouts with CSS Grid/Flexbox
- **Modern Aesthetics**: Clean, minimal interface
- **Accessibility**: Proper form labels and semantic HTML
- **Consistent Spacing**: Standardized gaps and padding

## Google OAuth Integration

### Client-Side OAuth Flow

1. User clicks "Login with Google"
2. Browser navigates to server's `/auth/google` endpoint
3. Server redirects to Google OAuth consent screen
4. User grants permission
5. Google redirects to server callback
6. Server establishes session and redirects back to client
7. Client detects login and updates state

### Configuration

OAuth requires proper setup:
- Google Cloud Console project
- Authorized origins: `http://localhost:5173` (dev), `https://yourapp.com` (prod)
- Authorized redirect URIs on server

## Development

### Hot Reload
Vite provides instant feedback during development:
- Component changes reflect immediately
- Style updates without page refresh
- TypeScript errors in terminal and browser

### TypeScript Configuration
- Strict type checking enabled
- React 19 types included
- Modern ES modules support
- Vite-specific type definitions

### Code Quality
- ESLint with React and TypeScript rules
- Automatic formatting on save (if configured)
- Type safety throughout the application

## Production Deployment

### Build Process
```bash
npm run build
```

Creates optimized production bundle:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Asset optimization and hashing
- Source maps for debugging

### Environment Configuration

Production environment variables:
```bash
VITE_API_URL=https://your-api-domain.com
```

### Security Considerations

For production deployment:
1. Use HTTPS for all communications
2. Configure proper CORS origins
3. Set secure cookie flags on server
4. Implement proper CSP headers
5. Use environment-specific API URLs

## Browser Support

- Modern browsers with ES2020+ support
- Chrome 80+, Firefox 80+, Safari 14+, Edge 80+
- Mobile browsers supported
- No Internet Explorer support

## Performance

### Optimization Features
- Code splitting with React Router
- Tree shaking eliminates unused code
- Automatic asset optimization
- HTTP/2 server push ready
- Service worker ready for PWA features

### Bundle Size
- Small initial bundle size
- Lazy loading for route components
- Efficient dependency usage
- Modern build tooling with Vite

## Contributing

When contributing to the client:

1. Follow TypeScript best practices
2. Add proper error handling
3. Include loading states for async operations
4. Test authentication flows thoroughly
5. Ensure responsive design
6. Add JSDoc comments for complex functions

## License

This project is for educational purposes.
