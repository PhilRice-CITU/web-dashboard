# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

React admin dashboard for the Rice Vision system. Provides analytics, device management, and scan result review with role-based access control. Currently uses mock data in several pages — see "Backend Integration" below.

## Commands

```bash
# Development
npm install
npm run dev             # http://localhost:3000

# Build
npm run build
npm run preview

# Testing
npm run test            # Vitest unit tests
npm run test:watch
npm run test:e2e        # Playwright E2E
npm run test:e2e:ui     # Interactive Playwright explorer

# Code quality
npm run lint            # ESLint check
npm run format          # Prettier check
npm run check           # Format + lint fix (both)
npm run pre-commit      # Lint staged + build (runs automatically via Husky)
```

Pre-commit hooks (Husky) run ESLint, Prettier, and a build check automatically on `git commit`. If they fail, auto-fixes are applied — re-stage and commit again.

## App Architecture

```
src/
├── routes/             — TanStack Router (file-based); __root.tsx is the layout shell
├── pages/              — Full page components (LandingPage, LoginPage, RegisterPage, DashboardPage)
├── api/
│   ├── client.ts       — Axios client (sends Bearer token, redirects to /login on 401)
│   └── types/openapi.ts — Auto-generated from API OpenAPI schema (do not hand-edit)
├── hooks/useApi.ts     — TanStack Query hooks wrapping the API client
├── store/appStore.ts   — Zustand: auth state, theme, UI flags
├── providers/          — ThemeProvider (CSS variable injection), QueryProvider
└── lib/
    ├── themes.ts       — 6 themes (light, dark, monokai, nord, dracula, solarized)
    ├── mockData.ts     — Placeholder analytics data (replace with real API calls)
    └── schemas.ts      — Zod validation schemas for forms
```

## Auth

Auth token lives in localStorage key `authToken`. The Axios client in `src/api/client.ts` attaches it as `Authorization: Bearer <token>` on every request and clears it + redirects to `/login` on any 401 response.

Roles: `user` (standard) and `admin`/PI (elevated access). PI access is gated by a PI key (`PHILRICE-PI-2026` in demo mode) entered during registration.

## Theme System

6 themes defined in `src/lib/themes.ts`. Theme selection persists in localStorage. `ThemeProvider` injects CSS custom properties on the `<html>` element — all color usage should reference these variables, not hardcoded values.

## Backend Integration

Several pages currently use `src/lib/mockData.ts`. When connecting to the real `api-server`:

1. Set env vars in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   VITE_WS_BASE_URL=ws://localhost:3001
   ```
2. Regenerate TypeScript types from the live API:
   ```bash
   npx openapi-typescript http://localhost:3001/openapi.json -o src/api/types/openapi.ts
   ```
3. Replace `mockData` imports with `useApi` hooks in affected pages.

WebSocket events expected: `device.heartbeat`, `device.status.changed`, `analysis.result.created`, `logs.event`, `command.ack`.

## Routes

| Route        | Auth |
| ------------ | ---- |
| `/`          | No   |
| `/login`     | No   |
| `/register`  | No   |
| `/dashboard` | Yes  |

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```
