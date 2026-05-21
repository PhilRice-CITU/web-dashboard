# Design — Edge Client Documentation Section

**Date:** 2026-05-22
**Repo:** `web-dashboard` (the docs site)
**Status:** Approved design, ready for implementation planning

## 1. Goal

Add an **Edge Client** section to the web-dashboard `/docs` site — a
documentation set for the Raspberry Pi grading device (the `edge-client`):
how to install it, provision it, operate it, configure it, keep it updated,
and (for developers) how it is built.

## 2. Context

The `edge-client` is a Raspberry Pi kiosk runtime — Electron 39 + React 19,
a touchscreen, dual cameras (IR + white-LED), GPIO-controlled relays/LEDs, and
a physical capture button. It captures rice-sample images and uploads them to
the api-server `/edge/v1/...` endpoints (authenticated with `X-Device-ID` +
`X-Device-Secret`); the api-server grades them and they appear in the
dashboard. The repo already has a solid `README.md` and `CLAUDE.md` — the new
docs draw on those plus the actual code.

The `/docs` site already exists (built earlier) with four sections — Getting
Started, Using the Dashboard, Grading & Standards, Technical Reference — driven
by MDX content files plus a `docs.config.ts` nav tree.

## 3. Audience

Three personas, all served by this section:

- **Field operator** — non-technical; presses the capture button, reviews,
  submits. (Pages 1, 4.)
- **Technician** — installs the `.deb` on the Pi, provisions the device,
  configures `.env`, troubleshoots. (Pages 2, 3, 5, 6.)
- **Developer** — modifies/builds/releases the edge-client. (Page 7.)

## 4. What gets built

A new **Edge Client** section in the `/docs` site, placed in the nav between
**Grading & Standards** and **Technical Reference**.

Content lives in `web-dashboard/src/content/docs/edge-client/` as MDX files.
Pages 1–6 use an operator/technician tone; page 7 uses a developer tone.

### Pages

1. **Overview** (`overview.mdx`) — what the Rice Vision edge device is (Pi
   kiosk: touchscreen, dual cameras IR + white-LED, GPIO relays, physical
   capture button) and how it fits the system: capture → upload to the
   api-server `/edge/v1/...` → graded → appears in the dashboard.
2. **Installing on a Raspberry Pi** (`installing.mdx`) — hardware checklist
   (Pi 4/5, touchscreen, dual cameras, GPIO relays + LEDs, capture button);
   installing the `.deb`; what the post-install does (seeds `.env`, registers
   the kiosk autostart); reboot. A short "from source (development)" note.
3. **First-time setup** (`first-time-setup.mdx`) — provisioning a new device
   (pick region → Register → it receives `device_id` + `device_secret`) or
   claiming a pre-provisioned device; what the Splash → Setup flow does.
4. **Daily operation** (`daily-operation.mdx`) — the kiosk screens (Splash →
   Home → Session); the capture flow (button → dual-camera shot → review →
   submit); the upload queue.
5. **Configuration & modes** (`configuration.mdx`) — the
   `~/.config/Hum.ai/.env` file and its variables (`DEVICE_ID`,
   `DEVICE_SECRET`, `DEVICE_DISPLAY_NAME`, `API_BASE_URL`, `REGION_CODE`,
   `EDGE_MODE`); production vs. training mode.
6. **Updates & troubleshooting** (`updates-and-troubleshooting.mdx`) — the
   auto-updater (checks GitHub Releases, installs on quit); common problems —
   camera/`rpicam-still`, GPIO/relay, network/connectivity, device-auth
   (`X-Device-ID`/`X-Device-Secret`) failures.
7. **Developer reference** (`developer-reference.mdx`) — architecture (Electron
   main / preload / renderer; React 19 + TanStack Router & Query; the IPC
   bridge; the GPIO module; `capture.sh`) and how the `.deb` is built &
   released (`npm run release:*` → GitHub Actions → GitHub Releases;
   `electron-builder.yml`, `build-deb.sh`).

## 5. Content

Starter content for all 7 pages is drafted from the edge-client's existing
`README.md` / `CLAUDE.md` and the actual code, for the user to refine. Pages
must be accurate to the code (e.g. the real env-var names, the real provision
flow with no `provision_token`, the real screen/route names).

## 6. Integration (follows the existing `/docs` pattern exactly)

- Create `web-dashboard/src/content/docs/edge-client/` with the 7 `.mdx` files.
- Add one `Edge Client` section to `web-dashboard/src/features/docs/docs.config.ts`,
  positioned between `Grading & Standards` and `Technical Reference`, listing
  the 7 slugs in page order. That single config entry wires the sidebar nav,
  search, and prev/next paging.
- Each `.mdx` file needs `title` + `description` frontmatter. They may use the
  existing global MDX components (`<Callout>`, `<CardGrid>`, `<DocCard>`) — no
  imports needed.
- No new components, no routing changes, no build-config changes.

## 7. Verification

- `npm run build` succeeds; `npm run test` passes (the `docs-registry` /
  `docs.config` consistency tests confirm every new slug has a file and every
  file is in the nav).
- `npx tsc --noEmit` — docs feature stays type-clean.
- The new section renders in the `/docs` site with working nav, search, TOC,
  and prev/next.

## 8. Out of scope

- Any change to the `edge-client` code.
- The training-pipeline (`hum-ai-training`) documentation — explicitly deferred
  ("focus on edge client first").
- New docs-site infrastructure — this reuses the existing section pattern.
