# Design — hum.ai Documentation Page

**Date:** 2026-05-21
**Repo:** `web-dashboard`
**Status:** Approved design, ready for implementation planning

## 1. Goal

Add a professional, standalone **documentation site** to the `web-dashboard` React app —
laid out like a modern docs product (Trackly-style: grouped left nav, centered content,
right "On this page" TOC) but using hum.ai's existing brand and color tokens.

It replaces the current placeholder `DocumentationPage` (a card grid of external links).

## 2. Approved decisions

| Decision | Choice |
|----------|--------|
| Audience & content | **Both, sectioned** — an operator guide *and* a technical reference, grouped into nav sections |
| Layout | **Standalone full-screen docs**, opens in a **new browser tab** when "Documentation" is clicked in the dashboard sidebar. App sidebar is not shown. |
| Content authoring | Draft starter content for the operator guide; wire up the existing `docs-and-architecture` markdown for the technical reference |
| Rendering | **MDX** — `.mdx`/`.md` files compiled at build time; React components embeddable in content |
| Branding | hum.ai 4-petal logo + "hum.ai" / "Rice Analytics", matching `AppSidebar` |
| Colors | Reuse the web-dashboard CSS variable tokens (`:root` + `.dark`). No new palette. |

## 3. Visual design (approved mockup — v8)

Three-column grid, **one flat background color edge to edge** — no panel, no border, no
rounded frame, no divider lines between columns.

```
┌───────────────── max-width 1120px, centered ─────────────────┐
│  SIDEBAR 226px   │      CONTENT (1fr)        │   TOC 196px    │
│                  │                           │                │
│  [logo] hum.ai   │   ┌── max-width 580px ──┐ │  ON THIS PAGE  │
│         Rice…    │   │  H1 title           │ │  • Introduction│
│         [☀/☾]    │   │  body prose         │ │  • Section…    │
│  ← Back to Dash  │   │  H2 sections        │ │                │
│  [🔍 Search ⌘K]  │   │  cards / callouts   │ │  (scroll-spy)  │
│                  │   │  ← prev   next →    │ │                │
│  GETTING STARTED │   └─── centered ────────┘ │                │
│   Introduction●  │                           │                │
│   …              │                           │                │
│  USING THE DASH  │                           │                │
│  GRADING & STDS  │                           │                │
│  TECHNICAL REF   │                           │                │
└──────────────────┴───────────────────────────┴────────────────┘
```

Key visual rules:
- **Background:** single token color — `--background` (`#ffffff` light / `~#1f1f1f` dark).
  Sidebar, content and TOC all share it. Margins left/right of the 1120px cap are the
  same color (reads as breathing room, not a panel).
- **Nav:** flat — **no collapsible groups**. Group labels are small uppercase muted text.
- **Active nav item:** subtle `--accent` fill only (matches the dashboard's own sidebar
  active state). No blue text, no left accent bar.
- **Content:** centered reading column, `max-width` ~580px, inside the content column.
- **Dark mode:** reuses the existing `.dark` tokens; orange logo is constant in both.
- **Typography:** Geist Variable (already global). Code via a syntax-highlight theme.

## 4. Architecture

### 4.1 Routing (TanStack Router, file-based)

The docs site is a **new top-level route tree, outside** `_authenticated` — it must not
render `PlatformShell` (the app sidebar/header).

```
src/routes/
  docs.tsx          → layout route: renders <DocsLayout> with <Outlet/>
  docs/
    index.tsx       → /docs        — renders the Introduction page
    $.tsx           → /docs/$slug  — splat route, resolves slug → MDX module
```

- `/docs` and `/docs/<section>/<page>` are the URLs.
- **Auth:** the docs route is **public (no auth guard)** — documentation should open
  cleanly in a new tab, and the content is reference material, not sensitive data.

### 4.2 MDX pipeline (Vite)

Add `@mdx-js/rollup` to `vite.config.ts`, **before** the React plugin. Remark/rehype:

| Plugin | Purpose |
|--------|---------|
| `remark-gfm` | tables, task lists, strikethrough |
| `remark-frontmatter` + `remark-mdx-frontmatter` | expose frontmatter (`title`, `description`) as named exports |
| `rehype-slug` | stable `id`s on headings — needed for TOC anchors + scroll-spy |
| `rehype-highlight` | code-block syntax highlighting (lightweight, build-time) |

- `.mdx` files compile in full MDX mode (operator guide — can embed React components).
- `.md` files compile in lenient CommonMark mode (the copied technical reference) — no
  JSX parsing, so existing markdown drops in without escaping issues.

### 4.3 Content structure

```
src/content/docs/
  getting-started/
    introduction.mdx
    dashboard-overview.mdx
    first-login-and-roles.mdx
  using-the-dashboard/
    results.mdx
    devices.mdx
    analytics.mdx
    test-grading.mdx
  grading-and-standards/
    how-grading-works.mdx
    quality-grades.mdx
    defect-types.mdx
  technical-reference/
    api-architecture.md       ← copy of docs-and-architecture/api-server/architecture.md
    database-schema.md        ← copy of …/database-schema.md
    grading-pipeline.md       ← copy of …/grading-pipeline.md
    metrics-contract.md       ← copy of …/metrics-contract.md
    device-events.md          ← copy of …/device-events-operations.md
```

Each file has frontmatter: `title`, `description`.

> **Note:** the technical-reference `.md` files are generated by the sync script
> (§4.10) from the `docs-and-architecture` repo — they are not edited by hand.

### 4.4 Content registry

`src/features/docs/lib/docs-registry.ts` uses `import.meta.glob` to collect all doc
modules and resolve a URL slug → lazy-loaded MDX component + frontmatter.

```ts
const modules = import.meta.glob('/src/content/docs/**/*.{md,mdx}')
// slug "getting-started/introduction" → () => import('…/introduction.mdx')
```

The `docs/$.tsx` splat route looks up `params._splat` in this registry, lazy-loads the
module, and renders it; unknown slugs render a "page not found" docs state.

### 4.5 Navigation config

`src/features/docs/docs.config.ts` — the **single source of truth for sidebar order and
grouping** (titles come from each file's frontmatter):

```ts
export const docsNav: DocsSection[] = [
  { label: 'Getting Started', items: [
      'getting-started/introduction',
      'getting-started/dashboard-overview',
      'getting-started/first-login-and-roles' ] },
  { label: 'Using the Dashboard', items: [ 'using-the-dashboard/results', … ] },
  { label: 'Grading & Standards', items: [ … ] },
  { label: 'Technical Reference', items: [ … ] },
]
```

This config also drives **prev/next paging** (flatten the list) and the **search index**.

### 4.6 Components

```
src/features/docs/
  docs.config.ts            — nav tree
  types.ts                  — DocsSection, DocMeta, TocItem
  lib/
    docs-registry.ts        — import.meta.glob loader + slug resolution
  hooks/
    useDocsTheme.ts         — light/dark toggle, persisted to localStorage
    useTableOfContents.ts   — extract headings + IntersectionObserver scroll-spy
    useDocSearch.ts         — builds + queries the client-side search index
  components/
    DocsLayout.tsx          — 3-column grid, 1120px cap, one bg color
    DocsSidebar.tsx         — brand, back-to-dashboard, search trigger, nav groups
    DocsSearch.tsx          — ⌘K command dialog (shadcn `command` component)
    DocsTOC.tsx             — right "On this page" rail with active highlight
    DocsPager.tsx           — prev/next footer links
    DocsThemeToggle.tsx     — sun/moon button
    mdx/
      mdx-components.tsx     — element → styled component map (h1–h4, p, ul, code,
                              pre, table, a, blockquote, img …)
      Callout.tsx           — note/warning box (MDX component)
      CardGrid.tsx          — responsive card grid (MDX component)
      DocCard.tsx           — single card used inside CardGrid
```

Existing shadcn primitives are reused: `dialog`/`command` (search), `badge` (the "PNS"
tag), `button`, `separator`. The `command` component is added via the shadcn CLI.

### 4.7 Theme

- `useDocsTheme` toggles the `.dark` class on `<html>` and persists a `theme` key in
  `localStorage`. Because the docs reuse the dashboard tokens, this is a **global**
  theme — toggling it in the docs tab also applies to the dashboard tab.
- Initial theme: read `localStorage.theme`, else fall back to `prefers-color-scheme`.

### 4.8 Search

- `⌘K` / `Ctrl+K` (and the sidebar search field) open a `DocsSearch` command dialog.
- Index = built client-side from `docs.config.ts` + each page's frontmatter
  (`title`, `description`) + extracted headings. ~15 pages — a plain substring/fuzzy
  filter is enough; no search service.
- Selecting a result navigates to that doc page (and heading anchor if matched).

### 4.9 Table of contents

- `useTableOfContents` reads rendered `<h2>`/`<h3>` elements (ids from `rehype-slug`),
  builds the list, and uses an `IntersectionObserver` to highlight the active heading
  while scrolling. Clicking an item smooth-scrolls to the anchor.

### 4.10 Technical-reference sync script

`scripts/sync-docs.mjs` — a plain Node script (no extra deps) exposed as
`npm run sync:docs`. It copies the five source markdown files from the sibling
`docs-and-architecture` repo into `src/content/docs/technical-reference/`, mapping
each to its target filename:

| Source (`../docs-and-architecture/api-server/`) | Target |
|---|---|
| `architecture.md` | `api-architecture.md` |
| `database-schema.md` | `database-schema.md` |
| `grading-pipeline.md` | `grading-pipeline.md` |
| `metrics-contract.md` | `metrics-contract.md` |
| `device-events-operations.md` | `device-events.md` |

The script prepends `title`/`description` frontmatter (so synced files render
consistently) and warns if a source file is missing. Run manually when the source
docs change; it is **not** wired into the build.

### 4.11 Updating / adding documentation

The docs system stays current with minimal effort:

- **Edit an existing operator-guide page** — edit the `.mdx` file in
  `src/content/docs/`. Hot-reloads in dev; picked up on the next build. TOC and heading
  anchors regenerate automatically — no config change.
- **Add a new operator-guide page** — create the `.mdx` file (with `title`/`description`
  frontmatter), then add its slug to the matching section in `docs.config.ts`. That one
  entry wires it into the sidebar nav, prev/next paging, and search together.
- **Update technical-reference pages** — edit the source in `docs-and-architecture`,
  then run `npm run sync:docs`. Adding a brand-new tech-ref file also needs an entry in
  the sync map (§4.10) and in `docs.config.ts`.
- No index rebuild, no manual TOC — `import.meta.glob` discovers files and the TOC is
  derived from rendered headings at runtime.

## 5. Data flow

```
User clicks "Documentation" in dashboard sidebar
  → opens /docs in a NEW TAB  (<a href="/docs" target="_blank">)
       │
       ▼
  docs.tsx layout route → <DocsLayout>
       │  renders DocsSidebar (nav from docs.config.ts)
       │           DocsTOC    (headings from rendered content)
       ▼
  docs/index.tsx OR docs/$.tsx
       │  resolves slug via docs-registry (import.meta.glob)
       ▼
  Lazy-loads the MDX module → renders through MDXProvider(mdx-components)
       → DocsPager shows prev/next from the flattened nav
```

## 6. Content plan (starter draft)

**Operator guide — drafted from observable dashboard features (`.mdx`):**

- *Getting Started* — Introduction (landing, uses `<CardGrid>`); Dashboard overview;
  First login & roles (admin vs. superadmin, region scoping).
- *Using the Dashboard* — Results; Devices; Analytics; Test Grading.
- *Grading & Standards* — How grading works (PNS/BAFS 290:2025 overview); Quality
  grades; Defect types.

**Technical reference — copied verbatim from `docs-and-architecture` (`.md`):**

- API architecture, Database schema, Grading pipeline, Metrics contract, Device events.

Starter content is a first draft for the user to refine; technical-reference pages are
copied as-is.

## 7. Files to create / modify

**Create:**
- `src/routes/docs.tsx`, `src/routes/docs/index.tsx`, `src/routes/docs/$.tsx`
- `src/features/docs/**` (config, types, lib, hooks, components — see §4.6)
- `src/content/docs/**` (~15 `.mdx`/`.md` files — see §4.3)
- `scripts/sync-docs.mjs` — technical-reference sync script (§4.10)

**Modify:**
- `vite.config.ts` — add `@mdx-js/rollup` plugin
- `src/shared/components/layout/AppSidebar.tsx` — "Documentation" item opens `/docs`
  in a new tab instead of an in-app router link
- `package.json` — new dependencies
- `src/app/styles.css` — import the `rehype-highlight` (highlight.js) code theme;
  minor `prose`-style rules for MDX content if needed

**Remove (replaced):**
- `src/routes/_authenticated/docs.tsx`
- `src/pages/DocumentationPage.tsx`

## 8. Dependencies to add

`@mdx-js/rollup`, `@mdx-js/react`, `remark-gfm`, `remark-frontmatter`,
`remark-mdx-frontmatter`, `rehype-slug`, `rehype-highlight`.
Dev type packages as needed. The shadcn `command` component is generated via CLI.

## 9. Error handling & edge cases

- **Unknown `/docs/<slug>`** — render an in-layout "Page not found" state with a link
  back to `/docs` (not a full app crash).
- **`/docs` direct visit** (new tab, no referrer) — works; route is public.
- **Empty TOC** (page with no `h2`/`h3`) — TOC rail renders nothing / collapses.
- **Responsive** — below ~`lg`: sidebar collapses into a drawer (shadcn `Sheet`)
  toggled by a header button; the TOC is hidden; content goes full width.
- **MD vs MDX** — a stray `<` or `{` in a technical `.md` file must not break the build;
  `.md` files compile in CommonMark (non-JSX) mode to prevent this.

## 10. Out of scope (YAGNI)

- Auto-running the sync script in CI / on build — it is a manual `npm run sync:docs`.
- Versioned docs, i18n, doc-level access control / role gating.
- Server-side or service-based search; analytics on doc usage.
- Editing docs from within the dashboard UI.

## 11. Resolved decisions

1. **Auth** — the `/docs` route is **public** (no auth guard).
2. **"Back to Dashboard" target** — links to **`/results`** (the de-facto home).
3. **Technical-reference freshness** — kept current via the **sync script** (§4.10),
   run manually with `npm run sync:docs`.

## 12. Testing

- **Unit (Vitest):** `docs-registry` slug resolution; `docs.config` ↔ content file
  consistency (every nav slug has a file, every file is in the nav); `useDocSearch`
  filtering; prev/next paging logic.
- **E2E (Playwright):** open `/docs`; navigate between pages via the sidebar; TOC
  anchor scroll; `⌘K` search → result navigation; theme toggle persists; unknown
  slug shows the not-found state.
