# Sijadin Frontend

> Seamless Reporting. Beyond Paperwork.

Premium Enterprise SaaS application built with React, TypeScript, and cutting-edge design principles.

## 🎨 Design Philosophy

The interface feels like "Oxygen" - removing the weight of bureaucracy through:
- **Liquid Flow & Clean Glass** aesthetics
- **Glassmorphism** with backdrop blur effects
- **Framer Motion** for liquid animations
- **Lenis** for buttery smooth scrolling
- **Phosphor Icons** (Light/Thin weight)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access
- Development: http://localhost:5173
- API Endpoint: http://localhost:8000/api/v1

## 📦 Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Styling
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lenis** - Smooth scroll

### State & Data
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client

### Editor
- **Tiptap** - Headless rich text editor
- **React Dropzone** - File upload

### Icons
- **Phosphor React** - Icon library (Light/Thin weight)

## 🎯 Features

### ✅ Implemented (Phase 12)
- [x] Vite + React + TypeScript setup
- [x] TailwindCSS with custom design system
- [x] React Router for navigation
- [x] Axios HTTP client with interceptors
- [x] TanStack Query for data fetching
- [x] Auth context & token storage
- [x] Protected route wrapper
- [x] Base UI components:
  - Button (with liquid animations)
  - Input (with glassmorphism)
  - Card (with hover effects)
  - Modal (with blur reveal)
- [x] Layout components:
  - Sidebar (collapsible, glassmorphism)
  - Header (with search & notifications)
  - MainLayout (responsive)
- [x] Pages:
  - Login (with animated background)
  - Dashboard (with stats & recent reports)

### 🔜 Coming Next (Phase 13)
- [ ] Complete auth flow
- [ ] Register page
- [ ] Logout functionality
- [ ] Token refresh

## 🎨 Design System

### Colors
```css
/* Backgrounds */
--snow: #FFFFFF
--vapor: #F0F9FF

/* Primary */
--sapphire: #0F172A
--teal: #06B6D4

/* Status */
--success: #10B981
--error: #F43F5E
```

### Typography
- **Font**: Inter Tight (Light/Regular/Medium)
- **Mono**: JetBrains Mono
- **Letter Spacing**: -0.02em for headlines

### Components

#### Button
```tsx
<Button variant="primary|secondary|teal|ghost" size="sm|md|lg">
  Click Me
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  placeholder="Enter email"
  icon={<Icon />}
/>
```

#### Card
```tsx
<Card glass hover padding="md">
  Content
</Card>
```

#### Modal
```tsx
<Modal isOpen={true} onClose={() => {}} title="Title">
  Content
</Modal>
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── layout/          # Layout components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── MainLayout.tsx
├── pages/               # Page components
│   ├── Dashboard.tsx
│   └── Login.tsx
├── lib/                 # Utilities
│   ├── axios.ts         # HTTP client
│   └── utils.ts         # Helper functions
├── hooks/               # Custom hooks
├── store/               # Zustand stores
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎭 Animation Principles

### Motion
- **Page Load**: Stagger from bottom (y: 20) with high damping
- **Modals**: Unfold with blur reveal (blur: 10px → 0px)
- **Buttons**: Lift on hover, scale on click (0.98)
- **Cards**: Translate Y on hover (-4px)

### Scroll
- **Lenis**: Smooth, heavy scrolling
- **lerp**: 0.05 (smooth interpolation)
- **duration**: 1.2s

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Tailwind Config
Custom colors, animations, and utilities in `tailwind.config.js`

### Vite Config
Path aliases and server config in `vite.config.ts`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run build
```

## 📝 Development Guidelines

### Component Creation
1. Use TypeScript for all components
2. Export as default
3. Use Framer Motion for animations
4. Follow glassmorphism design
5. Use Phosphor icons (Light/Thin)

### Styling
1. Use Tailwind utility classes
2. Use custom classes from `index.css`
3. Avoid inline styles
4. Use `clsx` for conditional classes

### State Management
1. Use TanStack Query for server state
2. Use Zustand for client state
3. Use React Context for auth

## 🚢 Deployment

### Build
```bash
npm run build
```

### Docker
```bash
docker build -t sijadin-web .
docker run -p 80:80 sijadin-web
```

### Nginx
Production build uses Nginx with:
- Gzip compression
- SPA routing
- Static asset caching
- Security headers

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [TanStack Query](https://tanstack.com/query)
- [Phosphor Icons](https://phosphoricons.com)

---

**Built with ❤️ for seamless reporting**
