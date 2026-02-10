# Learning Management System - Frontend

A modern, aesthetic Learning Management System frontend built with React, TypeScript, and Tailwind CSS. Features a Udemy-inspired design with beautiful UI components.

## 🚀 Features

- **Authentication**: Login and Register pages with JWT token management
- **Home Page**: Beautiful banner with featured courses grid
- **Course Discovery**: Browse all available courses with attractive course cards
- **My Learning**: View all enrolled courses in one place
- **Course Detail**: Udemy-style course detail page with enrollment functionality
- **Course Content**: Interactive course viewer with sidebar navigation for chapters
- **Protected Routes**: Automatic authentication checks and redirects
- **Responsive Design**: Mobile-first design that works on all devices

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth transitions and hover effects
- Clean, intuitive navigation
- Card-based layouts
- Sticky navigation and sidebars
- Loading states and error handling
- Beautiful color scheme (Purple, Pink, Gray)

## 📦 Tech Stack

- **React 19** with TypeScript
- **React Router DOM** for navigation
- **Axios** for API calls
- **Tailwind CSS 4** for styling
- **Vite** for fast development and building

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## 🔧 Configuration

The API base URL is configured in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx      # Main navigation bar
│   ├── CourseCard.tsx  # Course card component
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Home.tsx        # Landing page with courses
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── MyEnrollments.tsx
│   ├── CourseDetail.tsx
│   └── CourseContent.tsx
├── services/           # API services
│   ├── api.ts          # Axios instance with interceptors
│   ├── authService.ts  # Authentication API calls
│   └── courseService.ts # Course API calls
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## 🎯 Pages Overview

### Home (`/`)
- Hero banner with gradient background
- Feature highlights
- Grid of all available courses
- Call-to-action buttons for registration

### Login (`/login`)
- Email and password authentication
- Error handling
- Redirect to home after login
- Link to registration page

### Register (`/register`)
- User registration form
- Choose role (Student/Creator)
- Password confirmation
- Form validation

### My Enrollments (`/my-enrollments`) - Protected
- List of enrolled courses
- Direct access to course content
- Empty state with call-to-action

### Course Detail (`/course/:courseId`)
- Course overview with description
- Chapter listing
- Enrollment button
- Features and benefits
- Sticky enrollment card

### Course Content (`/course/:courseId/content`) - Protected
- Video player area (placeholder)
- Chapter sidebar navigation
- Previous/Next navigation
- Course overview section
- Full-screen layout

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Access tokens stored in `localStorage`
- Automatic token refresh on 401 errors
- Protected routes redirect to login
- Automatic logout on token expiration

## 🎨 Tailwind CSS

The project uses Tailwind CSS 4 with the new Vite plugin for ultra-fast styling. Key color scheme:
- Primary: Purple (600, 700)
- Secondary: Pink
- Background: Gray (50, 100)
- Text: Gray (600, 700, 900)

## 📝 API Endpoints Used

- `POST /api/accounts/signup/` - Register
- `POST /api/accounts/login/` - Login
- `POST /api/token/refresh/` - Refresh token
- `GET /api/courses/` - List courses
- `GET /api/courses/:id/` - Course detail
- `POST /api/courses/:id/enroll/` - Enroll in course
- `GET /api/courses/my-enrollments/` - My enrollments
- `GET /api/courses/:id/content/` - Course content

## 🚀 Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All components adapt to different screen sizes with appropriate layouts.
