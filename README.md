# AnyWork - Frontend

![AnyWork Banner](https://img.shields.io/badge/AnyWork-Job%20Portal-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

> A modern job portal frontend connecting job seekers with employers through an intuitive, responsive interface.

## 📋 Overview

AnyWork is a full-featured job portal frontend built with Next.js 16 (App Router) and TypeScript. It provides separate dashboards for job seekers and employers with real-time notifications, job applications, and profile management.

**Live Demo:** [https://anywork-frontend-pi.vercel.app](https://anywork-frontend-pi.vercel.app)

## ✨ Features

### 🎯 For Job Seekers
- **Advanced Job Search** - Filter by role, location, salary, and experience
- **One-Click Applications** - Apply with saved profiles and resumes
- **Application Tracking** - Real-time status updates
- **Profile Management** - Complete profile with skills and experience
- **Saved Jobs** - Bookmark opportunities for later

### 🏢 For Employers
- **Job Posting** - Create and manage job listings
- **Candidate Pipeline** - Review and manage applications
- **Company Profile** - Showcase company information
- **Analytics Dashboard** - Track job performance metrics
- **Team Collaboration** - Add team members with roles

### 🛠 Platform Features
- **JWT Authentication** - Secure login with token management
- **Responsive Design** - Mobile-first approach
- **Real-time Notifications** - Instant updates for applications

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Backend API running (Django REST Framework)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jubriltayo/anywork-frontend.git
cd anywork-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your settings:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📁 Project Structure

```
app/                    # Next.js App Router pages
├── (auth)/            # Authentication pages
├── dashboard/         # Protected dashboard routes
│   ├── employer/     # Employer dashboard
│   └── job-seeker/   # Job seeker dashboard
├── jobs/             # Job listings and details
└── notifications/    # Notifications center

components/           # React components
├── auth/            # Authentication components
├── employer/        # Employer-specific components
├── job-seeker/      # Job seeker components
├── layout/          # Layout components
├── notifications/   # Notification components
├── shared/          # Shared UI components
└── ui/              # shadcn/ui components

lib/                 # Core utilities
├── contexts/        # React contexts (Auth, Notifications)
├── hooks/           # Custom React hooks
├── services/        # API service classes
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL` | No | Frontend app URL | `http://localhost:3000` |

### Backend Integration

This frontend is designed to work with the [AnyWork Backend](https://github.com/jubriltayo/anywork) which provides:

- User authentication (JWT)
- Job and application management
- Notification system
- File upload handling

Ensure your backend is running and CORS is properly configured.

## 🎨 Design System

The project uses a consistent design system built with:

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible component primitives
- **Lucide React** for icons
- **CSS Variables** for theming

## 📱 Pages & Routing

### Public Routes
- `/` - Landing page
- `/jobs` - Job listings with filters
- `/jobs/[id]` - Job details
- `/login` - User login
- `/register` - User registration

### Protected Routes (Authentication Required)

#### Job Seeker Dashboard
- `/dashboard` - Overview
- `/dashboard/profile` - Profile management
- `/notifications` - Notification center

#### Employer Dashboard
- `/dashboard/employer` - Employer overview
- `/dashboard/employer/jobs` - Job postings
- `/dashboard/employer/applications` - Application management
- `/dashboard/employer/profile` - Company profile
- `/dashboard/employer/analytics` - Performance metrics

## 🔐 Authentication

The app uses JWT-based authentication:

1. Users login via `/login` page
2. Access and refresh tokens stored in localStorage
3. Tokens automatically attached to API requests
4. Protected routes redirect unauthenticated users to login
5. Token refresh handled automatically on 401 responses

## 📡 API Integration

### Available Services
- `AuthService` - Authentication and user management
- `JobService` - Job CRUD operations
- `ApplicationService` - Application management
- `EmployerService` - Employer-specific operations
- `NotificationService` - Notification handling

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Development with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy automatically on push

### Docker Deployment

```bash
# Build image
docker build -t anywork-frontend .

# Run container
docker run -p 3000:3000 anywork-frontend
```

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 📈 Performance

The application is optimized for performance:

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Optimization**: Tree-shaking and minification
- **Caching**: API response caching strategies