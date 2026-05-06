# Web Dashboard Structure Review

This review explains the current `web-dashboard/src` layout and the fastest way to trace code paths.

## High-Level Architecture

```text
src/
├── app/        # App wiring (providers, router, global styles, uiStore)
├── routes/     # TanStack file-based routes (URL -> page entry)
├── pages/      # Page-level composition components
├── features/   # Domain logic by concern (analytics, devices, auth, etc.)
└── shared/     # Reusable cross-feature code (api, ui, hooks, lib)
```

## What Goes Where (Separation of Concerns)

- `app/`: global setup only
  - `providers/` for app-wide providers
  - `store/uiStore.ts` for UI-only Zustand state
  - `router.tsx` and `styles.css`
- `routes/`: routing files only (`createFileRoute`, metadata, page wiring)
- `pages/`: top-level screens that assemble feature hooks + components
- `features/<domain>/`: domain-owned code
  - `components/`, `hooks/`, `mappers/`, `types/`, `schemas/`, `mocks/`, `utils/`
- `shared/`: anything reused by multiple domains
  - `api/` (HTTP client + API contracts)
  - `components/ui/` (shadcn primitives), `components/layout/` (shell/sidebar/nav)
  - `hooks/` (generic hooks), `lib/` (supabase, realtime, utilities, scoring)

## How Files Traverse (Request -> UI -> Data)

For any screen, traversal is usually:

1. **Route file** in `src/routes/...`
2. **Page component** in `src/pages/...`
3. **Feature hooks/components** in `src/features/<domain>/...`
4. **Shared infra** in `src/shared/...` (API client, UI primitives, helpers)

### Example: Devices Flow

1. `src/routes/_authenticated/devices.tsx`
2. `src/pages/DevicesPage.tsx`
3. `src/features/devices/hooks/useDeviceFleet.ts` and sibling hooks
4. `src/shared/hooks/useApi.ts` -> `src/shared/api/client.ts`
5. UI rendering via `src/features/devices/components/*` and `src/shared/components/layout/PlatformShell.tsx`

### Example: Analytics Flow

1. `src/routes/_authenticated/analytics.tsx`
2. `src/pages/AnalyticsPage.tsx`
3. `src/features/analytics/hooks/useAnalyticsData.ts`
4. `src/shared/hooks/useApi.ts` / `src/shared/api/client.ts`
5. charts in `src/features/analytics/components/charts/*`

## Fast Trace Guide (By Task)

- **Add new page route**
  - Add route file in `src/routes/`
  - Add page in `src/pages/`
  - Compose from one feature domain in `src/features/...`
- **Change API shape**
  - Update `src/shared/api/contracts.ts`
  - Update feature mappers in `src/features/*/mappers/`
  - Update feature types in `src/features/*/types/`
- **Adjust auth behavior**
  - Start in `src/features/auth/hooks/`
  - Check `src/app/providers/AuthProvider.tsx`
  - Check route guard in `src/routes/_authenticated.tsx`
- **Change sidebar/header shell**
  - `src/shared/components/layout/PlatformShell.tsx`
  - `src/shared/components/layout/AppSidebar.tsx`
  - nav items in `NavMain.tsx`, `NavSecondary.tsx`, `NavUser.tsx`

## Current Structure Quality

### What is cleaner now

- Domain code is centralized under `features/`.
- Generic infrastructure is centralized under `shared/`.
- App setup concerns are isolated in `app/`.
- Route/page/feature layering is clearer and easier to follow.

### Remaining conventions to keep

- Keep pages thin: orchestration only.
- Keep domain logic in feature hooks/mappers, not in pages.
- Keep cross-domain code in `shared/`, not copied into features.
- Keep generated artifacts (`routeTree.gen.ts`, OpenAPI types) out of manual edits.
