# Auth Lab

A modern fullstack authentication application showcasing secure user authentication patterns with both local email/password and Google OAuth integration. Built with TypeScript, React, Express.js, and Prisma ORM.

## 🚀 Overview

Auth Lab demonstrates production-ready authentication implementation with session-based security, featuring a clean separation between a RESTful API server and a modern React frontend. The application showcases best practices for user authentication, authorization, session management, and secure API design.

## ✨ Features

### 🔐 Authentication
- **Local Authentication**: Secure email/password registration and login
- **OAuth Integration**: Google OAuth 2.0 for social login
- **Session Management**: HTTP-only cookies with secure session handling
- **Account Linking**: Automatic linking of OAuth accounts by email

### 🛡️ Security
- **Password Hashing**: Argon2id algorithm (memory-hard, GPU-resistant)
- **Session Security**: HTTP-only, SameSite cookies with CSRF protection
- **Input Validation**: Comprehensive validation with Zod schemas
- **Error Handling**: Generic error messages to prevent user enumeration
- **CORS Protection**: Configurable cross-origin request handling

### 🎨 User Experience
- **Modern UI**: Clean, responsive React interface
- **Protected Routes**: Automatic authentication checks and redirects
- **Real-time Feedback**: Loading states and user feedback
- **Profile Management**: User nickname editing and account management

### 🏗️ Architecture
- **RESTful API**: Well-documented Express.js backend
- **Type Safety**: Full TypeScript implementation
- **Database ORM**: Prisma with SQLite (easily configurable for other databases)
- **Modern Frontend**: React 19 with Vite for fast development

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Authentication**: Passport.js (Local + Google OAuth)
- **Database**: Prisma ORM with SQLite
- **Security**: Helmet, CORS, Argon2 password hashing
- **Validation**: Zod for schema validation
- **Session Store**: Express sessions (memory store for dev, Redis recommended for production)

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios with automatic cookie handling
- **State Management**: React Context for authentication
- **Styling**: CSS-in-JS (inline styles)

### Development Tools
- **Language**: TypeScript for full-stack type safety
- **Code Quality**: ESLint configuration
- **Development**: Hot reload with ts-node-dev (backend) and Vite (frontend)
- **Database**: Prisma Studio for database management

## 📁 Project Structure

```
auth-lab/
├── server/                 # Express.js backend API
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   ├── auth.ts        # Authentication context
│   │   ├── passport.ts    # Passport strategies
│   │   ├── api.ts         # API client configuration
│   │   ├── routes/        # API route handlers
│   │   └── types/         # TypeScript type definitions
│   ├── prisma/            # Database schema and migrations
│   ├── README.md          # Server documentation
│   └── API.md             # API documentation
├── client/                # React frontend application
│   ├── src/
│   │   ├── main.tsx       # React entry point
│   │   ├── App.tsx        # Main app component
│   │   ├── auth.tsx       # Authentication context
│   │   ├── api.ts         # HTTP client
│   │   └── pages/         # Page components
│   ├── README.md          # Client documentation
│   └── COMPONENTS.md      # Component documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/cozydenis/auth-lab.git
cd auth-lab
```

### 2. Setup Backend
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

The server will start on `http://localhost:4000`

### 3. Setup Frontend
```bash
cd ../client
npm install

# Start development server
npm run dev
```

The client will start on `http://localhost:5173`

### 4. Access the Application
- Open `http://localhost:5173` in your browser
- Try registering a new account or logging in
- Test Google OAuth integration (requires Google OAuth setup)

## 🔧 Configuration

### Server Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# Session Security
SESSION_SECRET="your-super-secret-session-key-min-32-characters"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# CORS
CLIENT_ORIGIN="http://localhost:5173"
```

### Client Environment Variables
```env
# API Configuration
VITE_API_URL=http://localhost:4000
```

## 📚 Documentation

### Detailed Documentation
- **[Server Documentation](./server/README.md)**: Complete backend setup and API guide
- **[API Documentation](./server/API.md)**: Detailed API endpoint reference
- **[Client Documentation](./client/README.md)**: Frontend architecture and component guide
- **[Component Documentation](./client/COMPONENTS.md)**: In-depth component analysis

### Key Features Explained

#### Authentication Flow
1. **Registration**: User creates account → Password hashed with Argon2 → Session established
2. **Login**: Credentials verified → Session created → Access granted to protected routes
3. **OAuth**: Google OAuth dance → Account created/linked → Session established
4. **Session**: HTTP-only cookies maintain authentication state across requests

#### Security Measures
- **Password Security**: Argon2id hashing prevents rainbow table attacks
- **Session Security**: HTTP-only cookies prevent XSS token theft
- **CSRF Protection**: SameSite cookie attribute mitigates CSRF attacks
- **Input Validation**: Zod schemas prevent injection attacks
- **Error Handling**: Generic messages prevent user enumeration

## 🌟 Key Learning Outcomes

This project demonstrates:

### Backend Development
- Express.js API design with TypeScript
- Passport.js authentication strategies
- Session-based authentication vs JWT patterns
- Database design with Prisma ORM
- Security best practices implementation
- OAuth 2.0 integration patterns

### Frontend Development
- Modern React patterns with hooks and context
- TypeScript integration in React applications
- Authentication state management
- Protected routing implementation
- HTTP client configuration with cookies
- Form handling and validation

### Full-Stack Integration
- Client-server authentication flows
- Cookie-based session management
- CORS configuration for cross-origin requests
- Environment variable management
- Error handling across application layers

## 🚀 Production Deployment

### Backend Considerations
- Replace memory session store with Redis
- Use PostgreSQL or MySQL for production database
- Configure HTTPS and secure cookie settings
- Implement rate limiting and monitoring
- Set up proper logging and error tracking

### Frontend Considerations
- Build optimized production bundle
- Configure proper CORS origins
- Set up CDN for static assets
- Implement proper error boundaries
- Configure security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes and demonstrates modern fullstack authentication patterns.

## 🙏 Acknowledgments

- **Passport.js** for comprehensive authentication strategies
- **Prisma** for excellent TypeScript ORM experience
- **React** and **Vite** for modern frontend development
- **Argon2** for secure password hashing
- **TypeScript** for full-stack type safety

---

**Built with ❤️ by [Denis](https://github.com/cozydenis)**

*Auth Lab - Where authentication meets modern web development*