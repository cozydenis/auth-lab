# Client Components Documentation

## Overview

The Auth Lab client is built with React 19 and TypeScript, featuring a modular component architecture that separates concerns between authentication, routing, and user interface. This document provides detailed information about each component and their interactions.

## Architecture

### Component Hierarchy

```
App (AuthProvider)
├── BrowserRouter
│   ├── Nav
│   └── Routes
│       ├── Home (public)
│       ├── Login (public)  
│       ├── Register (public)
│       └── Profile (protected)
```

### State Management

- **Authentication State**: Managed via React Context (`auth.tsx`)
- **Component State**: Local state with React hooks (`useState`)
- **Form State**: Controlled components with real-time updates
- **Loading States**: Boolean flags for async operations

## Component Documentation

### Core Components

#### `main.tsx` - Application Entry Point

**Purpose**: Initializes React application with StrictMode and renders root component.

**Key Features**:
- React 19 createRoot API
- StrictMode for development warnings
- Global CSS imports

**Dependencies**:
- `react`, `react-dom/client`
- `App.tsx`, `index.css`

---

#### `App.tsx` - Main Application Container

**Purpose**: Root component that sets up routing, authentication, and layout.

**Key Features**:
- React Router configuration
- Authentication provider wrapper
- Global navigation
- Protected route implementation

**Components**:
- `Nav()` - Navigation bar with user status
- `Home()` - Landing page component
- `Protected()` - Route protection wrapper

**State**: None (stateless, uses context)

**Props**: None

**Dependencies**:
- `react-router-dom`
- `auth.tsx`
- Page components (`Login`, `Register`, `Profile`)

---

### Authentication System

#### `auth.tsx` - Authentication Context

**Purpose**: Centralized authentication state management and API integration.

**Key Features**:
- React Context for global auth state
- Session persistence and restoration
- Authentication methods (login, register, logout)
- Loading state management

**Types**:
```typescript
type User = { id: number, email: string, nickname: string } | null;

type AuthCtx = {
    user: User;
    loading: boolean;
    refresh: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};
```

**Hooks**:
- `useAuth()` - Access authentication context

**State Management**:
- `user` - Current authenticated user data
- `loading` - Authentication check status

**Lifecycle**:
1. Mount: Check existing session (`refresh()`)
2. Authentication: Update user state
3. Logout: Clear user state

---

#### `api.ts` - HTTP Client Configuration

**Purpose**: Configured Axios instance and authentication API methods.

**Configuration**:
- Base URL from environment variables
- Automatic cookie handling (`withCredentials: true`)
- JSON content type

**API Methods**:
- `AuthAPI.me()` - Get current user
- `AuthAPI.register(email, password)` - Create account
- `AuthAPI.login(email, password)` - Authenticate user
- `AuthAPI.logout()` - End session

**Error Handling**:
- Axios automatic error transformation
- Server error message extraction
- Network error handling

---

### Page Components

#### `Login.tsx` - Authentication Page

**Purpose**: User login interface with local and OAuth options.

**Features**:
- Email/password form with validation
- Google OAuth login button
- Error handling and display
- Form state management

**State**:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [err, setErr] = useState<string | null>(null);
```

**Methods**:
- `submit()` - Handle local login form submission
- `google()` - Initiate Google OAuth flow

**Error Handling**:
- Server validation errors
- Network connectivity issues
- Invalid credentials

**OAuth Flow**:
1. User clicks "Login with Google"
2. Browser redirects to `/auth/google`
3. Server handles OAuth dance
4. User redirected back to client
5. Session established automatically

---

#### `Register.tsx` - Account Creation Page

**Purpose**: New user registration with email and password.

**Features**:
- Registration form with validation
- Automatic login after registration
- Error handling and display
- Input validation

**State**:
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [err, setErr] = useState<string | null>(null);
```

**Validation**:
- Email format validation (browser + server)
- Password minimum length (8 characters)
- Required field validation

**Flow**:
1. User enters email/password
2. Client validates input
3. Registration request to server
4. Account created and session established
5. User automatically logged in

---

#### `Profile.tsx` - User Profile Management

**Purpose**: Protected page for authenticated users to manage their profile.

**Features**:
- Display user email (read-only)
- Edit nickname with server synchronization
- Save confirmation feedback
- Logout functionality

**State**:
```typescript
const [nickname, setNickname] = useState('');
const [msg, setMsg] = useState<string | null>(null);
```

**Lifecycle**:
1. Mount: Load current nickname from server
2. Edit: Real-time nickname updates
3. Save: Sync with server and show feedback
4. Logout: Clear session and redirect

**Error Handling**:
- Nickname save failures
- Server validation errors
- Network issues

---

### Utility Components

#### `Protected` - Route Protection Wrapper

**Purpose**: Higher-order component that protects routes requiring authentication.

**Logic**:
```typescript
if (loading) return <p>Loading...</p>;
if (!user) return <Navigate to="/login" replace />;
return children;
```

**Features**:
- Loading state during auth check
- Automatic redirect to login
- Preserve intended destination
- Use `replace` to avoid history pollution

---

#### `Nav` - Global Navigation

**Purpose**: Consistent navigation across all pages with auth status.

**Features**:
- Links to all main pages
- User status display (email or "Not logged in")
- Responsive flexbox layout
- Visual separation with border

**State**: None (uses auth context)

---

## Styling Architecture

### Approach
- Inline styles for simplicity and co-location
- CSS Grid and Flexbox for layouts
- Responsive design with max-width constraints
- Consistent spacing with gap properties

### Layout Patterns

**Form Layouts**:
```typescript
style={{ display: 'grid', gap: 8, maxWidth: 320 }}
```

**Navigation Layout**:
```typescript
style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #ddd' }}
```

**Button Groups**:
```typescript
style={{ display: 'flex', gap: 8 }}
```

### Design Principles
- Mobile-first responsive design
- Consistent spacing (8px, 12px units)
- Maximum widths for readability
- Clear visual hierarchy
- Accessible color contrast

---

## State Flow Diagrams

### Authentication Flow

```
App Mount
    ↓
AuthProvider.refresh()
    ↓
API.me() → Check Session
    ↓
Update Loading & User State
    ↓
Components Re-render
```

### Login Flow

```
User Input → Form State
    ↓
Form Submit → AuthAPI.login()
    ↓
Server Response → Update Auth Context
    ↓
Protected Routes Accessible
```

### Registration Flow

```
User Input → Form State
    ↓
Form Submit → AuthAPI.register()
    ↓
Account Created → Auto Login
    ↓
Update Auth Context → Redirect
```

---

## Error Handling Strategy

### Client-Side Errors
1. **Form Validation**: Browser HTML5 validation + custom checks
2. **Network Errors**: Axios interceptors and try/catch blocks
3. **Authentication Errors**: Context-level error handling
4. **Component Errors**: Local error state with user feedback

### Error Display
- **Form Errors**: Below form inputs in crimson color
- **Success Messages**: Green color for positive feedback
- **Loading States**: Spinner or "Loading..." text
- **Generic Fallbacks**: "Error" message for unknown issues

### Error Recovery
- **Retry Mechanisms**: Manual retry via user action
- **Session Refresh**: Automatic on auth errors
- **Graceful Degradation**: Fallback to login page
- **User Feedback**: Clear error messages and next steps

---

## Performance Considerations

### Optimization Techniques
- **Code Splitting**: React Router automatic splitting
- **Bundle Size**: Tree shaking with Vite
- **Re-renders**: Optimized context usage
- **Network**: Request deduplication with Axios

### Loading Strategies
- **Authentication**: Global loading state
- **Components**: Local loading states
- **Forms**: Disabled buttons during submission
- **Data**: Skeleton states for better UX

---

## Security Features

### Client-Side Security
- **Protected Routes**: Authentication checks
- **Input Validation**: Form validation before submission
- **Error Handling**: No sensitive data in error messages
- **Session Management**: Automatic cookie handling

### HTTPS Considerations
- **Development**: HTTP allowed for localhost
- **Production**: HTTPS required for cookies
- **Mixed Content**: All resources over HTTPS
- **Security Headers**: Handled by server

---

## Development Workflow

### Component Development
1. Create component with TypeScript
2. Add proper JSDoc documentation
3. Implement error handling
4. Add loading states
5. Test authentication scenarios

### Testing Checklist
- [ ] Component renders without errors
- [ ] Forms handle validation correctly
- [ ] Error states display properly
- [ ] Loading states work as expected
- [ ] Authentication flows complete successfully
- [ ] Protected routes redirect appropriately

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for React/TS
- Consistent naming conventions
- Proper error boundaries
- Accessible HTML structure

---

## Deployment Configuration

### Environment Variables
```bash
# Development
VITE_API_URL=http://localhost:4000

# Production  
VITE_API_URL=https://api.yourdomain.com
```

### Build Configuration
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Production Checklist
- [ ] Environment variables configured
- [ ] HTTPS enforced
- [ ] CORS origins restricted
- [ ] Error boundaries implemented
- [ ] Performance optimized
- [ ] Accessibility tested