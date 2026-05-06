# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

React admin dashboard for the Rice Vision system. Provides analytics, device management, and scan result review with role-based access control using live API data.

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
├── app/
│   ├── providers/      — AuthProvider + QueryProvider
│   ├── store/uiStore.ts — UI-only Zustand state (sidebar)
│   ├── router.tsx      — TanStack router registration
│   └── styles.css      — Global styles
├── routes/             — TanStack Router file routes; __root.tsx is app shell
├── pages/              — Top-level page entry components
├── features/           — Feature-first domains (auth, analytics, dashboard, devices, images, logs, landing)
│   └── <feature>/      — components, hooks, mappers, types, schemas, mocks, utils
└── shared/
    ├── api/            — Axios client, API contracts, generated OpenAPI types
    ├── components/     — shared layout + shadcn UI primitives
    ├── hooks/          — generic hooks (e.g., useApi, useMobile)
    └── lib/            — cross-cutting utilities (supabase, scoring, realtime SSE, utils)
```

## Auth

Authentication uses Supabase session tokens (`supabase.auth.getSession()`). The Axios client (`src/shared/api/client.ts`) attaches `Authorization: Bearer <access_token>` on each request.

Roles in dashboard flows are `superadmin` and `admin` (`region_id` scoped).

## Theme System

Theme primitives currently come from shared CSS variables and shadcn tokens. There is no `themes.ts` file in the current structure.

## Backend Integration

Dashboard pages are wired for live API data. For local integration:

1. Set env vars in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   VITE_WS_BASE_URL=ws://localhost:3001
   ```
2. Regenerate TypeScript types from the live API:
   ```bash
   npx openapi-typescript http://localhost:3001/openapi.json -o src/shared/api/types/openapi.ts
   ```
3. Verify API auth/session and route guards by testing protected pages (`/dashboard`, `/devices`, `/analytics`, `/logs`, `/images`).

WebSocket events expected: `device.heartbeat`, `device.status.changed`, `analysis.result.created`, `logs.event`, `command.ack`.

## Routes

| Route                    | Auth |
| ------------------------ | ---- |
| `/`                      | No   |
| `/about`                 | No   |
| `/login`                 | No   |
| `/register`              | No   |
| `/terms`                 | No   |
| `/auth/callback`         | No   |
| `/auth/complete-profile` | No   |
| `/dashboard`             | Yes  |
| `/devices`               | Yes  |
| `/devices/:deviceId`     | Yes  |
| `/images`                | Yes  |
| `/analytics`             | Yes  |
| `/logs`                  | Yes  |
| `/suggestions`           | Yes  |
| `/docs`                  | Yes  |

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```
