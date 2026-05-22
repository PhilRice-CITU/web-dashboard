# Edge Client Documentation Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Edge Client" section (7 MDX pages) to the web-dashboard `/docs` site documenting the Raspberry Pi grading device.

**Architecture:** Content-only addition that reuses the existing `/docs` infrastructure — MDX files under `src/content/docs/edge-client/`, plus one section entry in `docs.config.ts`. No new components, routes, or build config. Each MDX file has `title`/`description` frontmatter, a top-level `# h1`, and may use the global `<Callout>` / `<CardGrid>` / `<DocCard>` components (no imports needed).

**Tech Stack:** MDX, the existing web-dashboard docs feature (`src/features/docs/`).

**Spec:** `docs/superpowers/specs/2026-05-22-edge-client-docs-design.md`

**Working directory:** `/Users/valceven/Documents/School/Thesis/web-dashboard`, on `main` (the user has consented to committing directly to main). Commits trigger the Husky pre-commit hook (`lint-staged` + `npm run build`) — let it run.

**Content note:** The page content below is starter content drafted from the edge-client's `README.md` / `CLAUDE.md` and code (repo: `/Users/valceven/Documents/School/Thesis/edge-client`). Implementers should create each file with the content as written; if a concrete fact (an env-var name, a screen name, an install command) is easy to confirm against the edge-client repo, do so and correct it — the code is the source of truth.

---

## File Structure

**Create** (under `web-dashboard/`):

- `src/content/docs/edge-client/overview.mdx`
- `src/content/docs/edge-client/installing.mdx`
- `src/content/docs/edge-client/first-time-setup.mdx`
- `src/content/docs/edge-client/daily-operation.mdx`
- `src/content/docs/edge-client/configuration.mdx`
- `src/content/docs/edge-client/updates-and-troubleshooting.mdx`
- `src/content/docs/edge-client/developer-reference.mdx`

**Modify:**

- `src/features/docs/docs.config.ts` — add the `Edge Client` nav section.

**Task order:** Tasks 1–4 create the content files. Task 5 adds the `docs.config.ts` section (do it after the files exist so the nav↔file consistency tests pass). Task 6 verifies. Between Tasks 1–4 the content files exist but are not yet in the nav — that is fine (the pre-commit hook runs `build`, not the consistency tests; the build does not care).

---

## Task 1: Overview + Installing pages

**Files:**

- Create: `src/content/docs/edge-client/overview.mdx`
- Create: `src/content/docs/edge-client/installing.mdx`

- [ ] **Step 1: Create `overview.mdx`**

```mdx
---
title: Overview
description: What the Rice Vision edge device is and how it fits the system.
---

# Overview

The **edge device** is a Raspberry Pi kiosk that captures rice-sample images
and sends them to hum.ai for grading. It runs at the milling site; an operator
uses it through a touchscreen and a physical capture button.

## What's in the device

- A Raspberry Pi with a touchscreen
- Two cameras — one for an infrared (IR) shot, one for a white-LED shot
- GPIO-controlled relays and lighting
- A physical capture button

## How it fits the system

1. An operator places a rice sample and presses the capture button.
2. The device takes the IR and white-LED photos and uploads them to the hum.ai
   API.
3. The API runs the grading pipeline and stores the graded result.
4. The result appears in the **hum.ai dashboard**.

The device identifies itself to the API with a device ID and secret it
receives when it is first set up — see [First-time setup](/docs/edge-client/first-time-setup).

<CardGrid>
  <DocCard title="Installing" slug="edge-client/installing">
    Set up the device on a Raspberry Pi.
  </DocCard>
  <DocCard title="First-time setup" slug="edge-client/first-time-setup">
    Provision the device and give it an identity.
  </DocCard>
  <DocCard title="Daily operation" slug="edge-client/daily-operation">
    Capture and submit rice scans.
  </DocCard>
  <DocCard title="Developer reference" slug="edge-client/developer-reference">
    Architecture, building, and releasing.
  </DocCard>
</CardGrid>
```

- [ ] **Step 2: Create `installing.mdx`**

````mdx
---
title: Installing on a Raspberry Pi
description: Hardware checklist and how to install the edge-client on a Pi.
---

# Installing on a Raspberry Pi

## Hardware checklist

- A Raspberry Pi 4 or 5 with a touchscreen
- Two cameras wired for the IR and white-LED shots
- A GPIO relay board and LEDs for the controlled lighting
- A momentary push button wired to GPIO for the capture trigger

## Install the application

The edge-client ships as a Debian package (`.deb`). On the Pi:

1. Download the latest `Hum.ai-*-arm64.deb` from the project's GitHub Releases.
2. Install it:

   ```bash
   sudo dpkg -i Hum.ai-*-arm64.deb
   sudo apt-get install -f
   ```
````

3. Reboot the Pi.

The package's post-install step installs the Python dependency, seeds the
configuration file (`~/.config/Hum.ai/.env`) from a template if none exists,
and registers a desktop autostart entry. After the reboot, the kiosk launches
automatically on login.

<Callout>
  The device needs network access to the hum.ai API to provision and to upload
  scans. Make sure the Pi is on the network before first launch.
</Callout>

## Running from source (development)

To run the edge-client from source on a development machine or a Pi:

```bash
git clone <edge-client repo>
cd edge-client
./setup.sh          # one-time: system packages, npm + Python deps, .env
cd electron-app
npm run dev
```

````

- [ ] **Step 3: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/edge-client/overview.mdx src/content/docs/edge-client/installing.mdx
git commit -m "docs(edge-client): add Overview and Installing pages"
````

Append this trailer (message, blank line, then trailer):

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Let the Husky pre-commit hook run; do NOT use `--no-verify`. After committing run `git rev-parse HEAD`.

---

## Task 2: First-time setup + Daily operation pages

**Files:**

- Create: `src/content/docs/edge-client/first-time-setup.mdx`
- Create: `src/content/docs/edge-client/daily-operation.mdx`

- [ ] **Step 1: Create `first-time-setup.mdx`**

```mdx
---
title: First-time setup
description: Provisioning the edge device and giving it an identity.
---

# First-time setup

When the device starts for the first time it has no identity, so after the
splash screen it opens the **Setup** screen. There are two ways to set it up.

## Provision a new device

1. On the Setup screen, pick your **region** from the dropdown.
2. Tap **Register**.
3. The device contacts the hum.ai API, registers itself, and receives its
   `device_id` and `device_secret`. These are saved to the device's
   configuration automatically.
4. The device shows a confirmation (with a QR code) and moves to the **Home**
   screen.

## Claim a pre-provisioned device

If a device was already created for you, choose **Claim existing device** and
paste its `device_id`. The device adopts that identity instead of registering
a new one.

<Callout>
  The `device_id` and `device_secret` are stored in `~/.config/Hum.ai/.env` and
  are how the device authenticates every upload. Treat the secret like a
  password. See [Configuration & modes](/docs/edge-client/configuration).
</Callout>
```

- [ ] **Step 2: Create `daily-operation.mdx`**

```mdx
---
title: Daily operation
description: Using the kiosk to capture and submit rice scans.
---

# Daily operation

## The kiosk screens

- **Splash** — shown briefly at startup while the device loads.
- **Home** — the main screen: the capture button, recent sessions, and the
  upload queue.
- **Session** — the images and result for one capture.

## Capturing a scan

1. Place the rice sample on the device.
2. Press the physical **capture button** (or the on-screen capture button).
3. The device takes two photos — one under infrared, one under the white LED —
   and shows them for review.
4. Check the photos, then tap **Submit**.
5. The images upload to hum.ai for grading.

## The upload queue

If the network is briefly unavailable, submitted scans wait in the **upload
queue** on the Home screen and sync automatically once the connection returns.

<Callout>
  Once a scan is graded, its result appears in the hum.ai dashboard under
  Results.
</Callout>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/edge-client/first-time-setup.mdx src/content/docs/edge-client/daily-operation.mdx
git commit -m "docs(edge-client): add First-time setup and Daily operation pages"
```

Append the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer. Let the pre-commit hook run. Run `git rev-parse HEAD` after.

---

## Task 3: Configuration + Updates & troubleshooting pages

**Files:**

- Create: `src/content/docs/edge-client/configuration.mdx`
- Create: `src/content/docs/edge-client/updates-and-troubleshooting.mdx`

- [ ] **Step 1: Create `configuration.mdx`**

```mdx
---
title: Configuration & modes
description: The device configuration file, its variables, and run modes.
---

# Configuration & modes

## The configuration file

The device reads its configuration from `~/.config/Hum.ai/.env`. Most values
are written automatically during [first-time setup](/docs/edge-client/first-time-setup);
you rarely need to edit this file by hand.

| Variable              | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `DEVICE_ID`           | The device's unique identity (set during setup).       |
| `DEVICE_SECRET`       | The device's authentication secret (set during setup). |
| `DEVICE_DISPLAY_NAME` | A human-readable name for the device.                  |
| `API_BASE_URL`        | The hum.ai API the device uploads to.                  |
| `REGION_CODE`         | The region the device belongs to.                      |
| `EDGE_MODE`           | `production` or `training` — see below.                |

## Run modes

- **Production** — the normal mode: captured scans are uploaded and graded.
- **Training** — captures are collected as labelled training data for improving
  the grading model rather than being graded for a result.

<Callout>
  If you edit `~/.config/Hum.ai/.env` by hand, restart the device for the change
  to take effect.
</Callout>
```

- [ ] **Step 2: Create `updates-and-troubleshooting.mdx`**

```mdx
---
title: Updates & troubleshooting
description: How the device updates itself, and fixes for common problems.
---

# Updates & troubleshooting

## Updates

The device updates itself. It periodically checks for a newer published
release and installs it the next time the app restarts — no manual action is
needed. To force an update, restart the device.

## Troubleshooting

**The cameras don't take a photo.** Check that both cameras are connected and
seated. Capture is handled by a camera script on the Pi; a loose camera cable
is the most common cause.

**The lighting doesn't switch.** The IR and white LEDs are switched through a
GPIO relay. Check the relay wiring and the GPIO connections.

**The device can't reach the server.** Check the Pi's network connection and
that `API_BASE_URL` in the configuration points at the right hum.ai API.

**"Device authentication failed".** The `DEVICE_ID` / `DEVICE_SECRET` are
wrong, or the device was removed from the dashboard. Re-run
[first-time setup](/docs/edge-client/first-time-setup) to provision the device
again.

<Callout>
  If a problem persists, contact a system administrator with the device's
  display name and `DEVICE_ID`.
</Callout>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/edge-client/configuration.mdx src/content/docs/edge-client/updates-and-troubleshooting.mdx
git commit -m "docs(edge-client): add Configuration and Updates/troubleshooting pages"
```

Append the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer. Let the pre-commit hook run. Run `git rev-parse HEAD` after.

---

## Task 4: Developer reference page

**Files:**

- Create: `src/content/docs/edge-client/developer-reference.mdx`

- [ ] **Step 1: Create `developer-reference.mdx`**

```mdx
---
title: Developer reference
description: Edge-client architecture and the build & release pipeline.
---

# Developer reference

## Architecture

The edge-client is an Electron application:

- **Main process** (`electron-app/src/main/`) — runs IPC handlers, the
  auto-updater, the GPIO poller, and a `local-image://` protocol for showing
  captured images. GPIO relay control and capture-button polling live in
  `src/main/gpio.ts`.
- **Preload bridge** (`electron-app/src/preload/`) — exposes a small, safe API
  to the renderer over Electron's context bridge.
- **Renderer** (`electron-app/src/renderer/`) — the kiosk UI: React 19 with
  TanStack Router and TanStack Query, organized into pages, hooks, and
  components. API calls and the `X-Device-ID` / `X-Device-Secret` headers are
  built in `src/renderer/src/lib/api.ts`.

Camera capture is a bash script — `scripts/capture.sh` — that drives
`rpicam-still` and the GPIO relays. The main process spawns it and reads back
the image paths.

## Build & release

The device updates itself from GitHub Releases, so shipping a change is a
release:

1. From `electron-app/`, run `npm run release:patch` (or `release:minor` /
   `release:major`). This bumps the version, commits, tags, and pushes.
2. GitHub Actions builds the arm64 `.deb` and publishes it to GitHub Releases.
3. Devices pick the new version up through the auto-updater.

Packaging is configured in `electron-app/electron-builder.yml`; the `.deb`
build helper is `scripts/build-deb.sh`.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/content/docs/edge-client/developer-reference.mdx
git commit -m "docs(edge-client): add Developer reference page"
```

Append the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer. Let the pre-commit hook run. Run `git rev-parse HEAD` after.

---

## Task 5: Add the "Edge Client" nav section

**Files:**

- Modify: `src/features/docs/docs.config.ts`

- [ ] **Step 1: Add the section to `docsNav`**

Open `src/features/docs/docs.config.ts`. The `docsNav` array has four sections
in order: `Getting Started`, `Using the Dashboard`, `Grading & Standards`,
`Technical Reference`. Insert a new section object **between `Grading &
Standards` and `Technical Reference`**:

```ts
  {
    label: 'Edge Client',
    items: [
      'edge-client/overview',
      'edge-client/installing',
      'edge-client/first-time-setup',
      'edge-client/daily-operation',
      'edge-client/configuration',
      'edge-client/updates-and-troubleshooting',
      'edge-client/developer-reference',
    ],
  },
```

So the resulting `docsNav` order is: Getting Started → Using the Dashboard →
Grading & Standards → **Edge Client** → Technical Reference. Do not change the
other sections.

- [ ] **Step 2: Type-check**

Run:

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
npx tsc --noEmit 2>&1 | grep -E 'features/docs|content/docs'
```

Expected: no output. (The project has ~13 pre-existing unrelated tsc errors — out of scope; only the docs-feature grep matters.)

- [ ] **Step 3: Run the docs consistency + nav tests**

Run:

```bash
npm run test -- docs
```

Expected: the `docs.config`, `docs-registry`, and `docs-search` suites pass.
The `docs-registry` consistency tests confirm every one of the 7 new
`edge-client/*` slugs has a content file and every content file is in the nav.
If a test fails, a slug in `docs.config.ts` and a filename are out of sync —
fix whichever is wrong.

- [ ] **Step 4: Commit**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
git add src/features/docs/docs.config.ts
git commit -m "docs(edge-client): add Edge Client section to the docs nav"
```

Append the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer. Let the pre-commit hook run. Run `git rev-parse HEAD` after.

---

## Task 6: Verification

**Files:** none modified — verification only.

- [ ] **Step 1: Full test + type-check + build**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
npm run test
npx tsc --noEmit 2>&1 | grep -E 'features/docs|content/docs|routes/docs' ; echo "(docs tsc check done)"
npm run build
```

Expected: `npm run test` — all unit tests pass (the docs-registry consistency
tests now cover the 7 new pages); the tsc grep prints nothing; `npm run build`
succeeds.

- [ ] **Step 2: Confirm the section is wired**

```bash
cd /Users/valceven/Documents/School/Thesis/web-dashboard
ls src/content/docs/edge-client/
grep -n "Edge Client" src/features/docs/docs.config.ts
```

Expected: 7 `.mdx` files listed; the `Edge Client` section present in the config.

- [ ] **Step 3: Report**

Summarize: the 7 pages created, the nav section added, and the verification
results. No commit — verification only.

---

## Notes for the implementer

- Each `.mdx` file must have `title` + `description` frontmatter followed by a
  single top-level `# Heading` (the doc pages render the `# h1` as the page
  title — every existing content file follows this).
- The `<Callout>`, `<CardGrid>`, `<DocCard>` components are global via
  `MDXProvider` — do NOT add imports for them in the MDX files. `<DocCard>`
  takes a `slug` prop (e.g. `slug="edge-client/installing"`), not `href`.
- Internal links in prose use `/docs/<slug>` form (e.g.
  `/docs/edge-client/configuration`); the MDX `a` renderer routes them through
  the SPA.
- Commits trigger the Husky pre-commit hook (`lint-staged` + `npm run build`).
  Markdown files get prettier-formatted by lint-staged — if it reformats a
  staged file, re-stage and re-commit.
- Content is starter content for the user to refine; keep it accurate to the
  edge-client repo where it states concrete facts.
