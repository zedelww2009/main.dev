# Portfolio Dashboard

Modern, minimalist project management & portfolio dashboard built with Next.js 15+, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

## Design System

- Pure matte surfaces (no glassmorphism)
- Black / dark gray / white palette
- Soft shadows + rounded rectangles
- Smooth micro-interactions (hover + tap)
- Mobile-first responsive

## Getting Started

```bash
# Install dependencies
npm install

# Copy env example and fill in your Firebase credentials
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create a **Firestore Database** (start in test mode for development).
4. Register a Web app and copy the config values into `.env.local`.
5. (Optional) Recommended Firestore rules for development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Protected app routes
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── archive/
│   │   ├── settings/
│   │   └── profile/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Reusable primitives
│   ├── layout/          # Sidebar, TopNav, Shell
│   ├── projects/
│   ├── auth/
│   ├── settings/
│   └── backgrounds/
├── store/               # Zustand stores
├── types/
├── lib/
├── hooks/
└── contexts/
```

## Current Foundation Includes

- Design tokens & matte theme
- Reusable UI components (Button, Card, Input, Modal, SearchBar, Badge, EmptyState, Spinner)
- Collapsible sidebar + top navigation
- Dashboard overview with stats & activity
- Projects grid with search
- Settings page (background, accent, animation intensity, preferences)
- Auth page skeletons
- Type-safe models
- Zustand settings store with persistence

## Auth Features (Implemented)

- Email/password registration & login
- Forgot password (reset email)
- Session persistence via Firebase Auth
- Protected dashboard routes
- Public route redirects (logged-in users skip login/register)
- Profile update (display name)
- Account deletion with confirmation modal
- Sign out from sidebar

## Projects Features (Implemented)

- Create / edit / delete projects
- Archive & restore
- Search + category filters
- Thumbnail URL support
- Progress tracking
- Project detail page
- Dashboard stats from live data

## Background System (Implemented)

- Floating particles (with soft connection lines)
- Robotics grid (scan line + pulsing nodes)
- Neural network (layered nodes + animated links)
- Abstract geometric (rotating polygons)
- Minimal waves
- Switchable in Settings
- Animation intensity: low / medium / high
- Respects “Reduce motion” preference
- Canvas-based, dynamically imported, performance-friendly

## Polish (Implemented)

- Toast notification system (success / error / info / warning)
- Change password (Settings → reauthenticate + update)
- Toasts on create / update / archive / restore / delete / login / logout
- Confirmation modals for destructive actions

## Optional future enhancements

- Firebase Storage for thumbnail uploads
- Real-time Firestore listeners
- Activity log collection
- Keyboard shortcuts

## Tech Stack

- Next.js 15+ (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand
- Firebase
- React Icons
