# PhilRice AI Dashboard

Professional AI-powered rice quality analysis platform with real-time analytics, multi-device management, and role-based access control.

## 🎯 Key Features

- **Multi-Device Management** - Connect and group analysis devices across facilities
- **Real-Time Analytics** - Track grain quality metrics with interactive charts
- **Role-Based Access** - PI-protected access for principal investigators
- **6 Professional Themes** - VSCode-like themes (Light, Dark, Monokai, Nord, Dracula, Solarized)
- **Secure Authentication** - Email/password login with PI key option
- **Pre-Commit Hooks** - Automatic linting and build verification
- **Type-Safe API Integration** - OpenAPI-ready architecture

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Application Pages

| Route        | Purpose                      | Auth Required |
| ------------ | ---------------------------- | ------------- |
| `/`          | Landing page with features   | No            |
| `/login`     | Authentication               | No            |
| `/register`  | Account creation + PI access | No            |
| `/dashboard` | Main analytics platform      | Yes           |

## 🔐 Demo Credentials

### Standard User

- Email: `any@email.com`
- Password: `password123` (or any 8+ char password)
- Role: User

### PI (Principal Investigator)

- Email: `pi@example.com`
- Password: `password123`
- **PI Key: `PHILRICE-PI-2026`** (enter during registration)
- Role: Admin

## 📊 Dashboard Highlights

### Summary Cards

- **Total Samples**: 2,847 analyzed
- **Quality A %**: 68% grade A results
- **Online Devices**: Real-time status
- **Avg Moisture**: Stored moisture levels

### Device Management

- View connected analyzers
- Group devices (Lab, Field, Storage)
- Monitor last seen timestamp
- Track samples per device

### Analytics Charts

- **Quality Distribution**: 30-day trend lines
- **Moisture Content**: 14-day bar chart
- **Quality Pie Chart**: A/B/C/D grade breakdown
- **Recent Results**: Latest 10 analyses

### Quality Grades

- **Grade A** (68%) - Green - Best quality
- **Grade B** (18%) - Blue - Good quality
- **Grade C** (10%) - Amber - Fair quality
- **Grade D** (4%) - Red - Poor quality

## 🎨 Theme System

6 professional themes with automatic CSS variable injection:

```bash
# Available themes in app settings
- light      (Bright interface)
- dark       (Default)
- monokai    (Popular editor theme)
- nord       (Arctic blue palette)
- dracula    (Dark vampire theme)
- solarized  (Precision colors)
```

Theme selection persists in localStorage.

## 🛠 Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run test:e2e:ui      # Interactive test explorer

# Code Quality
npm run lint             # Check code
npm run format           # Check formatting
npm run check            # Format + lint fix

# Pre-Commit
npm run pre-commit       # Lint staged + build
```

## 📁 Project Structure

```
src/
├── pages/               # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── routes/              # TanStack Router
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── dashboard.tsx
├── lib/                 # Utilities
│   ├── themes.ts       # 6 color themes
│   ├── mockData.ts     # Mock analytics data
│   ├── schemas.ts      # Zod validation
│   └── utils.ts        # Helpers
├── store/              # Zustand state
│   └── appStore.ts
├── providers/          # React context
│   ├── ThemeProvider.tsx
│   └── QueryProvider.tsx
├── api/                # API client
│   ├── client.ts
│   └── types/openapi.ts
├── hooks/              # Custom hooks
│   └── useApi.ts
└── styles.css

e2e/                    # Playwright tests
.husky/                 # Git hooks
```

## 🔄 Git Pre-Commit Hooks

Automatic checks before each commit:

1. **ESLint** - Code style check & fix
2. **Prettier** - Format check & fix
3. **Build Test** - Ensures project compiles

```bash
# Hooks run automatically
git commit -m "Feature: add device grouping"

# If hooks fail, auto-fixes are applied
# Re-stage and commit again
git add .
git commit -m "Feature: add device grouping"

# To skip (not recommended)
git commit --no-verify
```

## 📱 Device Management

### Add Device

Click "Add Device" button to:

- Set device name
- Assign optional group
- Start monitoring

### Device Groups

Organize by location/function:

- **Lab** - Laboratory analyzers
- **Field** - Remote stations
- **Storage** - Warehouse monitors

### Device Status

- **Online** (🟢) - Active
- **Offline** (🔴) - Not reporting
- Last seen timestamp

## 💾 Technology Stack

See [TECH_STACK.md](./TECH_STACK.md) for complete tech breakdown.

**Frontend:**

- React 19 + TypeScript
- Vite (build tool)
- TanStack Router
- TanStack Query
- Tailwind CSS 4
- Recharts (charts)
- Zod (validation)
- Zustand (state)

**Testing:**

- Playwright (E2E)
- Vitest (Unit)

**DevOps:**

- Husky (pre-commit)
- ESLint + Prettier
- OpenAPI integration ready

## 🔌 Backend Integration Guide

This frontend is currently using mock data in several pages. Use the contract below to connect a real backend with minimal guesswork.

### Environment Variables

Set these in your `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_BASE_URL=ws://localhost:3001
```

- `VITE_API_BASE_URL` is already used by `src/api/client.ts`.
- `VITE_WS_BASE_URL` is recommended for live events/log streaming.

### Auth Model Expected by Frontend

The app expects a bearer token in local storage key `authToken`.

- Request interceptor sends: `Authorization: Bearer <token>`
- On `401`, frontend clears token and redirects to `/login`

Recommended auth endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Required REST Endpoints by Feature

#### Dashboard Page

- `GET /api/dashboard/summary`
  - Returns cards: total samples, online devices, avg moisture, avg broken grains.
- `GET /api/dashboard/grade-distribution`
  - Returns grade rows used in distribution panel.
- `GET /api/dashboard/moisture-watch`
  - Returns moisture risk list.

#### Devices Page

- `GET /api/devices`
  - Returns device list with: `id`, `name`, `group`, `status`, `lastSeen`, `samplesProcessed`, `cpu`, `latitude`, `longitude`, `location`.
- `POST /api/devices`
  - Add device from the "Add Device" panel.
- `PATCH /api/devices/:id`
  - Update group/location/status metadata.
- `GET /api/devices/:id/telemetry`
  - Returns live metrics shown in telemetry tiles.
- `POST /api/devices/:id/actions`
  - Body: `{ action: 'capture' | 'restart-app' | 'restart-device' | 'shutdown-device' | 'view-device' }`
  - Used by quick actions and expanded control buttons.
- `GET /api/devices/:id/camera/snapshot` (optional)
  - If not implementing stream yet, return latest snapshot URL.

#### Analytics Page

- `GET /api/analytics/timeseries`
  - Query params:
    - `startDate`, `endDate`
    - `station`
    - `grade`
    - `granularity` (`daily` | `weekly`)
    - `aggregation` (`sum` | `avg` | `min` | `max`)
  - Returns rows with keys used by charts:
    - `date`, `totalGrains`, `totalSamples`, `qualityA`, `qualityB`, `qualityC`, `qualityD`,
    - `avgMoisture`, `avgBrokenGrains`, `avgForeignMatter`, `avgChalkiness`, `avgDiscoloration`, `avgLengthMm`, `avgQualityScore`.
- `GET /api/analytics/headline`
  - Optional helper endpoint for top summary cards.

#### Logs Page

- `GET /api/logs/events`
  - Query params: `search`, `device`, `level`, `from`, `to`, `limit`, `cursor`.
  - Returns events: `time`, `device`, `level`, `message`.
- `GET /api/logs/export`
  - Supports CSV/JSON export for the "Export Logs" action.

### WebSocket Channels / Events

Use a single socket endpoint for simplicity:

- `GET ws://<host>/ws` or `GET ws://<host>/ws/realtime`

Recommended event names and payload context:

- `device.heartbeat`
  - `{ deviceId, status, cpu, memory, storage, temperature, queueDepth, cameraStatus, networkLatencyMs, timestamp }`
- `device.status.changed`
  - `{ deviceId, from, to, timestamp, reason }`
- `analysis.result.created`
  - `{ resultId, deviceId, qualityGrade, qualityScore, moistureContent, totalGrains, timestamp }`
- `logs.event`
  - `{ time, device, level, message }`
- `command.ack`
  - `{ commandId, deviceId, action, state, message, timestamp }`

Minimum usage by page:

- Dashboard: `device.heartbeat`, `device.status.changed`, `analysis.result.created`, `logs.event`
- Devices: `device.heartbeat`, `device.status.changed`, `command.ack`
- Logs: `logs.event`

### OpenAPI + Type Generation

Expose OpenAPI schema and regenerate client types:

```bash
npx openapi-typescript http://localhost:3001/api-json -o src/api/types/openapi.ts
```

Then use `apiClient` from `src/api/client.ts` for typed requests.

### Integration Checklist

1. Implement all endpoints listed above with stable response shapes.
2. Return ISO timestamps (UTC) for all date/time fields.
3. Send auth token in login/register response.
4. Broadcast websocket events for heartbeat/logs/actions.
5. Verify these pages against real backend data: `/dashboard`, `/devices`, `/analytics`, `/logs`.

See [TECH_STACK.md](./TECH_STACK.md) for backend stack alignment.

## 📚 Documentation

- **[APP_IMPLEMENTATION.md](./APP_IMPLEMENTATION.md)** - Complete app features & flow
- **[TECH_STACK.md](./TECH_STACK.md)** - Technology overview
- **[.env.example](./.env.example)** - Environment variables

## 🧪 Testing

### E2E Tests

```bash
npm run test:e2e

# Examples in e2e/example.spec.ts
- Landing page display
- Login/Register flows
- Dashboard access control
- Chart rendering
```

### Unit Tests

```bash
npm run test

# Test theme switching, auth, data filtering
```

## 🚀 Building & Deployment

### Local Build

```bash
npm run build
npm run preview
```

### Production Deployment

1. Update API base URL in `.env`
2. Verify authentication
3. Test all themes
4. Run security audit
5. Deploy to Vercel/Netlify/Docker

## 🎨 Customization

### Adding Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
```

### Changing Colors

Edit `src/lib/themes.ts` - 6 themes with full color control.

### Mock Data

Edit `src/lib/mockData.ts` for different analytics scenarios.

## 🐛 Troubleshooting

### Port 3000 in use

```bash
PORT=3001 npm run dev
```

### Build errors

```bash
rm -r node_modules
npm install
npm run build
```

### Theme not applying

Check browser DevTools - CSS variables should be set on `<html>` root.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Pre-commit hooks run automatically
4. Push when checks pass

## 📖 Learn More

- [React Documentation](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Zod Validation](https://zod.dev)
- [Playwright Testing](https://playwright.dev)

## 📄 License

MIT License - See LICENSE file

---

**🎉 Ready to develop!**

```bash
npm run dev
```

Visit http://localhost:3000 to start analyzing rice quality data!
