# Campus Connect - Setup Guide

## 🎓 Overview
Campus Connect is a full-stack college event management platform with a React + TypeScript frontend and Spring Boot backend.

## 🚀 Frontend Setup

### Prerequisites
- Node.js 18+ and npm
- Your Spring Boot backend running (typically on `http://localhost:8080`)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   
   For production, update this to your deployed backend URL.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080` (Vite default).

## 🔧 Backend Configuration

Ensure your Spring Boot backend is configured with:
- CORS enabled for the frontend URL
- All API endpoints following the expected structure (see API Endpoints below)
- JWT authentication configured

## 📡 API Endpoints Expected

### Public Endpoints
- `GET /api/public/events` - Get all events
- `GET /api/public/events/:id` - Get event by ID
- `GET /api/public/categories` - Get all categories
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Endpoints (Requires Authentication)
- `GET /api/user/profile` - Get user profile
- `GET /api/user/my-events` - Get user's registered events
- `POST /api/user/events/:id/register` - Register for an event
- `DELETE /api/user/events/:id/unregister` - Unregister from an event

### Admin Endpoints (Requires Admin Role)
- `GET /api/admin/events/:id/attendees` - Get event attendees
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `POST /api/admin/categories` - Create new category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## 🎨 Features

### For Students
- Browse and search upcoming events
- Filter events by category
- Register for events with one click
- View personal dashboard with registered events
- Manage registrations (unregister from events)

### For Admins
- Full CRUD operations for events
- Category management
- View attendee lists for each event
- Dashboard with quick stats

### General Features
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive design
- 🎨 Modern UI with purple and orange theme
- 🔐 Role-based access control (User/Admin)
- 🔒 JWT-based authentication

## 👥 User Roles

The application supports two roles:
- **USER** (`ROLE_STUDENT` or `ROLE_FACULTY`): Can browse and register for events
- **ADMIN** (`ROLE_ADMIN`): Full management capabilities

## 🎯 Default Test Accounts

Make sure your backend has these test accounts seeded:
- **Admin**: admin@example.com / password123
- **Student**: student@example.com / password123

## 🏗️ Project Structure

```
src/
├── api/              # Axios configuration
├── assets/           # Images and static files
├── components/       # Reusable components
│   ├── admin/        # Admin-specific components
│   ├── layout/       # Layout components (Navbar, Footer)
│   └── user/         # User-specific components
├── context/          # React Context (AuthContext)
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── App.tsx          # Main app component with routing
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token + user data
3. Token stored in `localStorage`
4. Axios interceptor adds token to all requests
5. Protected routes check authentication status
6. Role-based routes redirect based on user role

## 🎨 Theming

The app uses a design system with:
- **Primary Color**: Vibrant Purple (`hsl(270, 70%, 60%)`)
- **Secondary Color**: Warm Orange (`hsl(25, 95%, 55%)`)
- **Design Tokens**: All colors defined in `src/index.css`
- **Component Variants**: Custom button and card variants

## 📦 Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🐛 Common Issues

### CORS Errors
Ensure your Spring Boot backend has CORS configured:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Authentication Issues
- Check that JWT tokens are being sent in the `Authorization` header
- Verify token format: `Bearer <token>`
- Check token expiration time

### API Connection
- Verify `VITE_API_BASE_URL` in `.env`
- Ensure backend is running before starting frontend
- Check browser console for network errors

## 📚 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Router DOM
- Axios
- React Query

**Authentication:**
- JWT tokens
- Role-based access control
- Protected routes

## 🤝 Contributing

1. Create a new branch for features
2. Follow the existing code style
3. Test thoroughly before committing
4. Update this README if adding new features

## 📄 License

This project is for educational purposes.
