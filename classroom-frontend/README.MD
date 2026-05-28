# 🎓 Classroom Frontend

A modern, responsive frontend application for classroom management, built with React, TypeScript, Refine.dev, and shadcn/ui.

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Refine.dev](https://img.shields.io/badge/Refine-2.16-14141F?logo=react&logoColor=white)](https://refine.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.8-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Quick Start](#-quick-start)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

## ✨ Features

### Core Functionality
- 📊 **Dashboard Analytics** - Comprehensive data visualization with charts and KPIs
- 📚 **Class Management** - Create, view, and manage class sections
- 📖 **Subject Management** - Organize subjects by department
- 💬 **Discussion Forums** - Full-featured discussions with voting and threading
- 📅 **Schedule View** - Weekly class schedule visualization
- 🗺️ **Campus Map** - Interactive 3D campus map (Three.js)
- 🔐 **Authentication** - Session-based auth with role management
- 🎨 **Responsive Design** - Mobile-first, works on all devices

### Dashboard Features
- 📈 Real-time statistics cards
- 📊 Enrollment trends chart
- 🌡️ Department enrollment heatmap
- 📊 Class status distribution (Donut chart)
- 🌡️ Department distribution (Pie chart)
- 👨‍🏫 Top teachers list
- 📋 Recent classes table
- ⚠️ At-risk resources table
- 📅 Weekly schedule density
- 🔄 Data freshness indicator

### Discussion Forum
- 🧵 Nested replies (2 levels)
- 👍 Upvote/downvote system
- 📌 Pinned discussions
- 🔒 Locked discussions
- ✅ Accepted answers
- 🏷️ Discussion types (General, Question, Announcement, Resource)
- 📝 Markdown support with preview

### UI/UX Features
- 🌓 Dark/Light theme toggle
- 📱 Mobile-responsive sidebar
- 🔔 Toast notifications
- ⌨️ Keyboard shortcuts (KBar)
- ♿ Accessibility compliant
- 🎨 Beautiful animations (Framer Motion)
- 🎯 Loading states and skeletons

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19.1.0 |
| **Language** | TypeScript | 5.8.3 |
| **Build Tool** | Vite | 6.3.5 |
| **Framework** | Refine.dev | 2.16.x |
| **Routing** | React Router | 7.0.2 |
| **State Management** | TanStack Query | 5.90.x |
| **UI Library** | shadcn/ui | Latest |
| **Components** | Radix UI | Latest |
| **Styling** | Tailwind CSS | 4.1.x |
| **Charts** | Recharts | 2.15.x |
| **3D Graphics** | Three.js + React Three Fiber | 0.183.x |
| **Forms** | React Hook Form | 7.57.x |
| **Validation** | Zod | 3.24.x |
| **Auth** | Better-Auth | 1.5.x |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Lucide React | 0.487.x |
| **Markdown** | React Markdown + remark-gfm | 10.x |

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Browser                                      │    │
│  │                    Port: 5173 (dev)                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │ Cookies (better-auth.session_token)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REACT APPLICATION                                │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Refine.dev Framework                          │    │
│  │  • Resource-based routing                                        │    │
│  │  • Built-in CRUD hooks                                           │    │
│  │  • Authentication provider                                       │    │
│  │  • Data provider (REST)                                          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    State Management                              │    │
│  │  ┌──────────────────┐  ┌──────────────────┐                     │    │
│  │  │ TanStack Query   │  │  React Context   │                     │    │
│  │  │ • Server state   │  │  • Theme         │                     │    │
│  │  │ • Caching        │  │  • Auth          │                     │    │
│  │  │ • Invalidation   │  │  • Layout        │                     │    │
│  │  └──────────────────┘  └──────────────────┘                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      UI Components                               │    │
│  │  ┌──────────────────┐  ┌──────────────────┐                     │    │
│  │  │  shadcn/ui       │  │  Custom          │                     │    │
│  │  │  (46 components) │  │  Components      │                     │    │
│  │  │  • Buttons       │  │  • Dashboard     │                     │    │
│  │  │  • Forms         │  │  • Discussions   │                     │    │
│  │  │  • Layout        │  │  • Schedule      │                     │    │
│  │  │  • Charts        │  │  • Campus Map    │                     │    │
│  │  └──────────────────┘  └──────────────────┘                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Fetch API
                                    │ Credentials: include
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API                                      │
│  Express.js Server (Port 8000)                                          │
│  • Authentication (Better-Auth)                                         │
│  • REST API Endpoints                                                   │
│  • Rate Limiting (Arcjet)                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- Backend API running (see classroom-backend)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd classroom-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# VITE_BACKEND_BASE_URL=http://localhost:8000/api
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Application will open at `http://localhost:5173`

### Environment Variables

```bash
# Required
VITE_BACKEND_BASE_URL=http://localhost:8000/api

# Optional
VITE_API_URL=http://localhost:8000
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your-cloud/upload
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

## 📄 Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `AuthPage` | Login form |
| `/register` | `AuthPage` | Registration form |

### Protected Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Dashboard` | Main dashboard with analytics |
| `/schedule` | `SchedulePage` | Weekly class schedule |
| `/discussions` | `DiscussionsListPage` | Global discussions list |
| `/discussions/new` | `DiscussionsNewPage` | Create discussion |
| `/discussions/:discussionId` | `DiscussionsShowPage` | Discussion detail |
| `/subjects` | `SubjectsList` | Subjects list |
| `/subjects/create` | `SubjectsCreate` | Create subject |
| `/classes` | `ClassesList` | Classes list |
| `/classes/create` | `ClassesCreate` | Create class |
| `/classes/show/:id` | `ClassesShow` | Class detail |
| `/classes/:id/discussions` | `DiscussionsListPage` | Class discussions |
| `/campus-map` | `ComingSoon` | Campus map placeholder |

### Resource Configuration

```typescript
resources={[
  {
    name: 'Dashboard',
    list: '/',
    meta: { label: 'Dashboard', icon: <Home /> }
  },
  {
    name: 'schedule',
    list: '/schedule',
    meta: { label: 'Schedule', icon: <Clock /> }
  },
  {
    name: 'discussions',
    list: '/discussions',
    create: '/discussions/new',
    meta: { label: 'Discussions', icon: <MessageSquare /> }
  },
  {
    name: 'subjects',
    list: '/subjects',
    create: '/subjects/create',
    meta: { label: 'Subjects', icon: <BookOpen /> }
  },
  {
    name: 'classes',
    list: '/classes',
    create: '/classes/create',
    show: '/classes/show/:id',
    meta: { label: 'Classes', icon: <GraduationCap /> }
  }
]}
```

## 🧩 Components

### Component Structure

```
src/components/
├── ui/                      # shadcn/ui components (46 components)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── table.tsx
│   └── ...
├── refine-ui/               # Refine-specific components
│   ├── layout/
│   ├── theme/
│   ├── notification/
│   ├── form/
│   ├── data-table/
│   └── buttons/
├── dashboard/               # Dashboard components
│   ├── v2/
│   │   ├── StatsCards.tsx
│   │   ├── EnrollmentLineChart.tsx
│   │   ├── DepartmentPieChart.tsx
│   │   └── ...
│   └── ...
├── discussions/             # Discussion forum components
│   ├── DiscussionForm.tsx
│   ├── DiscussionsList.tsx
│   └── DiscussionDetail.tsx
├── schedule/                # Schedule components
└── ...
```

### Key Components

#### Dashboard Components (v2)
- `StatsCards` - KPI cards with statistics
- `EnrollmentLineChart` - Enrollment trends
- `DepartmentTrendLineChart` - Department trends
- `ClassStatusDonut` - Class status distribution
- `DepartmentPieChart` - Department distribution
- `TopTeachersList` - Top teachers ranking
- `RecentClassesList` - Recent classes table
- `AtRiskResourcesTable` - At-risk resources
- `WeeklyScheduleDensity` - Schedule heatmap

#### Discussion Components
- `DiscussionsList` - Discussion list with filters
- `DiscussionForm` - Create/edit discussion form
- `DiscussionDetail` - Discussion detail with replies

#### Layout Components
- `Layout` - Main app layout with sidebar
- `ThemeProvider` - Dark/light theme toggle
- `Toaster` - Toast notifications
- `StaleIndicator` - Data freshness indicator

## 🗄️ State Management

### TanStack Query (React Query)

Server state is managed with TanStack Query v5:

```typescript
// Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

### Query Invalidation

Automatic cache invalidation after mutations:

```typescript
// Invalidate relevant queries after create/update/delete
const invalidateQueries = (resource: string, action: string, id?: string) => {
  // Always invalidate dashboard
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  
  // Invalidate resource
  queryClient.invalidateQueries({ queryKey: [resource] });
  
  // Cross-resource invalidation
  if (resource === 'classes') {
    queryClient.invalidateQueries({ queryKey: ["discussions"] });
  }
};
```

### Custom Hooks

- `use-mobile` - Mobile detection
- `useCacheInvalidation` - Manual cache invalidation
- `useDashboard` - Dashboard data fetching

## 🔌 API Integration

### API Client

```typescript
// src/services/api.ts
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> { ... },
  async post<T>(endpoint: string, data?: any): Promise<T> { ... },
  async put<T>(endpoint: string, data?: any): Promise<T> { ... },
  async delete<T>(endpoint: string): Promise<T> { ... },
};
```

### Data Provider

Refine REST data provider with custom configuration:

```typescript
// src/providers/data.ts
const { dataProvider } = createDataProvider(BACKEND_BASE_URL, {
  getList: { ... },
  create: { ... },
  getOne: { ... },
  update: { ... },
  deleteOne: { ... },
});
```

### Services

- `api.ts` - Generic API client
- `dashboard.ts` - Dashboard-specific API calls

## 🔐 Authentication

### Auth Provider

```typescript
// src/providers/auth.ts
export const authProvider: AuthProvider = {
  login: async ({ email, password }) => { ... },
  logout: async () => { ... },
  check: async () => { ... },
  getPermissions: async () => { ... },
  getIdentity: async () => { ... },
  onError: async (error) => { ... },
};
```

### Auth Client

```typescript
// src/lib/auth-client.ts
export const authClient = createAuthClient({
  baseURL: BACKEND_BASE_URL.replace(/\/api\/?$/, ""),
  fetchOptions: {
    credentials: "include",
  },
});
```

### User Roles

- `student` - Default role
- `teacher` - Faculty role
- `admin` - Administrator role
- `guest` - Guest mode (optional)

## 📁 Project Structure

```
classroom-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui (46 components)
│   │   ├── refine-ui/             # Refine components
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── discussions/           # Discussion components
│   │   ├── schedule/              # Schedule components
│   │   └── ...
│   ├── pages/
│   │   ├── dashboard.tsx
│   │   ├── auth.tsx
│   │   ├── schedule.tsx
│   │   ├── campus-map.tsx
│   │   ├── coming-soon.tsx
│   │   ├── subjects/
│   │   ├── classes/
│   │   └── discussions/
│   ├── providers/
│   │   ├── auth.ts                # Auth provider
│   │   ├── data.ts                # Data provider
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── useCacheInvalidation.ts
│   │   └── useDashboard.ts
│   ├── services/
│   │   ├── api.ts                 # API client
│   │   └── dashboard.ts           # Dashboard API
│   ├── lib/
│   │   ├── auth-client.ts         # Better-auth client
│   │   └── queryClient.ts         # TanStack Query client
│   ├── constants/
│   │   └── index.ts               # App constants
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Global styles
│   └── index.tsx                  # Entry point
├── public/
│   └── logo.png
├── components.json                # shadcn/ui config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧑‍💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:clean        # Clean build cache and start

# Production
npm run build            # Build for production
npm run start            # Start production server

# Utilities
npm run refine           # Refine CLI
npm run refine build     # Refine build
```

### Code Quality

- **TypeScript:** Strict mode enabled
- **ESLint:** Configured with React and TypeScript rules
- **Prettier:** Code formatting

### Component Development

```bash
# Add new shadcn/ui component
npx shadcn@latest add button

# Add new Refine component
npm run refine create
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t classroom-frontend .

# Run container
docker run -p 5173:80 classroom-frontend
```

### Environment Variables (Production)

```bash
VITE_BACKEND_BASE_URL=https://api.yourdomain.com/api
VITE_API_URL=https://api.yourdomain.com
```

## 📚 Documentation

- [System Design](./docs/SYSTEM_DESIGN_FRONTEND.md) - Frontend architecture
- [Component Documentation](./docs/COMPONENTS.md) - Component reference
- [API Integration](./docs/API_INTEGRATION.md) - API client usage
- [Deployment Guide](./docs/DEPLOYMENT_FRONTEND.md) - Deployment instructions

## 🤝 Contributing

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Refine.dev](https://refine.dev/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Primitives
- [TanStack](https://tanstack.com/) - React Query
- [Vite](https://vite.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ using React, TypeScript, and Refine.dev**
