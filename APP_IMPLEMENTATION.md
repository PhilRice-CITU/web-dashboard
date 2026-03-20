# PhilRice AI Application - Complete Implementation Guide

## 🎨 Application Overview

A complete full-stack AI-powered rice quality analysis platform with multi-device management, real-time analytics, and role-based access control.

---

## 🎭 Theme System

### Multi-Theme Support (VSCode-like)

The application includes 6 professionally designed themes:

1. **Light** - Clean, bright interface
2. **Dark** - Easy on the eyes (default)
3. **Monokai** - Popular text editor theme
4. **Nord** - Arctic, north-bluish color palette
5. **Dracula** - Dark, vampire-inspired theme
6. **Solarized** - Precision colors for machines and people

**Theme Features:**

- Automatic CSS variable injection
- Persistent theme selection (localStorage)
- Smooth transitions between themes
- Tailwind CSS integration
- All UI colors themeable

**Implementation:**

```typescript
// In dashboard or settings
const { theme, setTheme } = useAppStore()

// Available themes
import { themes, ThemeName } from '#/lib/themes'

// Switch themes
setTheme('nord')
```

---

## 🚀 Application Flow

### Page Hierarchy

```
Landing Page (/)
├── Not Authenticated
├── Features showcase
└── CTA buttons → Login / Register

Login (/login)
├── Email + Password
├── Demo credentials accepted
└── Redirects to Dashboard

Register (/register)
├── Full Name
├── Email
├── Password confirmation
├── PI Access Key (optional)
│   └── Demo key: PHILRICE-PI-2026
└── Role assignment

Dashboard (/dashboard)
├── Protected route (redirects to login if not authenticated)
├── User must be authenticated
└── Full analytics interface
```

---

## 📊 Dashboard Features

### 1. **Account Summary**

Located at the top with key metrics:

- **Total Samples**: 2,847 analyzed
- **Quality A %**: 68% grade A results
- **Online Devices**: 2/3 devices online
- **Avg Moisture**: 13.2% content level

### 2. **Connected Devices Section**

Real-time device management:

- Device name and grouping
- Online/Offline status (green/red indicator)
- Samples processed count
- Last seen timestamp

**Example Devices:**

- Main Lab - Analyzer 1 (Lab group)
- Field Station - Analyzer 2 (Field group)
- Storage Facility - Analyzer 3 (Storage group)

**Add Device Modal:**

- Device name input
- Optional grouping (Lab, Field, Storage, etc.)
- Real-time addition to dashboard

### 3. **Analytics Charts**

#### Quality Distribution Over 30 Days

- Line chart showing Grade A, B, C trends
- X-axis: Dates
- Y-axis: Grain count
- Interactive tooltips

#### Moisture Content Trend

- Bar chart for last 14 days
- Helps track storage conditions
- Optimal range: 12-13%

#### Overall Quality Pie Chart

- Grade A: 68%
- Grade B: 18%
- Grade C: 10%
- Grade D: 4%

#### Recent Analysis Results

- Table of 5 most recent analyses
- Device name, timestamp
- Quality grade badge (color-coded)
- Grain count, moisture, broken grains

### 4. **Device Grouping**

Devices can be organized by:

- **Lab** - Laboratory analysis stations
- **Field** - Remote field stations
- **Storage** - Storage facility monitors
- **Custom** - User-defined groups

Enables unified data gathering across facilities.

---

## 🔐 Authentication System

### Login Flow

1. User navigates to `/login`
2. Enters email and password
3. Demo accepts any email format and 8+ character password
4. Creates authenticated session
5. Redirects to dashboard
6. User state stored in Zustand store

### Registration Flow

1. User navigates to `/register`
2. Enters:
   - Full name
   - Email
   - Password (8+ chars)
   - Confirm password
   - PI Key (optional)
3. PI Key validation:
   - Demo key: `PHILRICE-PI-2026`
   - If valid → grants admin role
   - If absent → grants user role
4. Account created, auto-redirects to dashboard

### Role System

- **Admin** (with PI key) - Full access, device management
- **User** (standard) - Dashboard access, view analytics
- **Viewer** - Read-only access (future)

---

## 💾 Mock Data Structure

### Rice Grain Analysis Result

```typescript
interface RiceGrainResult {
  id: string
  timestamp: string
  totalGrains: number // e.g., 1250
  qualityGrade: 'A' | 'B' | 'C' | 'D'
  moistureContent: number // 11-15%
  brokenGrains: number // count
  foreignMatter: number // percentage, <1%
  status: 'analyzed' | 'processing' | 'failed'
  deviceId: string
}
```

### Device Data

```typescript
interface Device {
  id: string
  name: string
  group?: string // Lab, Field, Storage
  status: 'online' | 'offline'
  lastSeen: string // ISO timestamp
  samplesProcessed: number
}
```

### Analytics Data

30-day historical breakdown:

- Date
- Total grains analyzed
- Grade A, B, C, D counts
- Average moisture content

---

## 🛠 Pre-Commit Hooks Setup

### What Gets Checked Before Push

**Configuration File:** `package.json` lint-staged section

### Automatic Actions:

1. **TypeScript/JavaScript files** (_.ts, _.tsx, _.js, _.jsx)
   - ESLint auto-fix
   - Prettier formatting
   - Build verification

2. **JSON/Markdown/YAML files**
   - Prettier formatting

3. **Full Build Test**
   - `npm run build` runs before commit
   - Verifies entire project compiles
   - Prevents broken code from being pushed

### Usage:

```bash
# Stage your changes
git add .

# Try to commit (hooks automatically run)
git commit -m "Fix: update dashboard theme"

# If hooks fail:
# 1. Auto-fixes are applied
# 2. Re-stage fixed files
# 3. Commit again

# To bypass hooks (not recommended)
git commit --no-verify
```

### Hook Configuration Files

**`.husky/pre-commit`** - Runs before each commit
**`package.json`** - lint-staged configuration

---

## 📱 Device Management

### Adding Devices

1. Click "Add Device" button (top right)
2. Enter device name
3. Optionally set group
4. Device appears in Connected Devices sections

### Device Groups

Unified data collection:

- **Lab Group** - Centralized lab analyzers
- **Field Group** - Remote site analyzers
- **Storage Group** - Warehouse monitors

Select group to filter analytics.

### Device Status

- **Online** (green dot) - Currently active
- **Offline** (red dot) - Not reporting data
- Last seen timestamp shows last data point

---

## 🎯 Quality Grading System

### Grade A (Best)

- 68% of analyzed samples
- Optimal moisture: 12-13%
- <2% broken grains
- <0.3% foreign matter
- Color: Green (#10b981)

### Grade B (Good)

- 18% of analyzed samples
- Acceptable moisture: 13-14%
- <5% broken grains
- <0.5% foreign matter
- Color: Blue (#3b82f6)

### Grade C (Fair)

- 10% of analyzed samples
- Higher moisture: 14-15%
- <10% broken grains
- <1% foreign matter
- Color: Amber (#f59e0b)

### Grade D (Poor)

- 4% of analyzed samples
- Very high moisture: >15%
- > 10% broken grains
- > 1% foreign matter
- Color: Red (#ef4444)

---

## 🔄 Data Flow Architecture

```
Landing Page
    ↓ (login/register)
Auth Pages
    ↓ (setUser in Zustand)
Protected Route Guard
    ↓ (check isAuthenticated)
Dashboard Page
    ↓ (query devices & analytics)
Recharts Components
    ↓ (render with mock data)
Real-time Visualizations
```

---

## 🚀 Running the Application

### Development

```bash
npm run dev
# Server: http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Interactive test UI
npm run test:e2e:ui
```

### Code Quality

```bash
# Check
npm run check      # Format + lint fix

# Just lint
npm run lint       # ESLint check

# Format check
npm run format     # Prettier check
```

---

## 📁 File Structure

```
src/
├── pages/
│   ├── LandingPage.tsx       # Landing page with features
│   ├── LoginPage.tsx         # Email/password login
│   ├── RegisterPage.tsx      # Account creation with PI key
│   └── DashboardPage.tsx     # Main analytics dashboard
│
├── lib/
│   ├── themes.ts            # Theme definitions (6 themes)
│   ├── mockData.ts          # Mock devices & analytics
│   ├── schemas.ts           # Zod validation
│   └── utils.ts             # Helper functions
│
├── store/
│   └── appStore.ts          # Zustand global state
│       ├── user (null | User)
│       ├── devices (Device[])
│       ├── theme (ThemeName)
│       ├── isAuthenticated (boolean)
│       └── actions
│
├── providers/
│   ├── ThemeProvider.tsx    # CSS var injection
│   └── QueryProvider.tsx    # React Query setup
│
├── api/
│   ├── client.ts            # Axios + OpenAPI setup
│   └── types/openapi.ts     # API types (auto-generated)
│
├── hooks/
│   └── useApi.ts            # useFetch, useCreate, etc.
│
└── routes/
    ├── __root.tsx           # Root layout
    ├── index.tsx            # Landing page
    ├── login.tsx            # Login route
    ├── register.tsx         # Register route
    └── dashboard.tsx        # Dashboard route
```

---

## 🎨 Color System

All colors are CSS variables injected by theme:

### Primary Colors

- `--primary`: Main brand color
- `--primary-foreground`: Text on primary
- `--secondary`: Secondary actions
- `--secondary-foreground`: Text on secondary

### UI Colors

- `--background`: Page background
- `--foreground`: Primary text
- `--muted`: Disabled/secondary element
- `--muted-foreground`: Text on muted
- `--border`: Border colors
- `--accent`: Highlights/emphasis

### Semantic Colors

- `--success`: ✓ Positive actions (green)
- `--destructive`: ✗ Negative actions (red)
- `--warning`: ⚠ Alerts (amber)
- `--info`: ℹ Information (blue)

---

## 🔗 API Integration Ready

### OpenAPI Integration Path

1. **Get OpenAPI spec** from backend:

   ```bash
   # From running server
   http://localhost:3001/api-json
   ```

2. **Generate types:**

   ```bash
   npx openapi-typescript http://localhost:3001/api-json -o src/api/types/openapi.ts
   ```

3. **Use in components:**
   ```typescript
   const { data } = apiClient.GET('/api/grains/{id}', {
     params: { path: { id: '123' } },
   })
   ```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```bash
npm run test

# With coverage
npm run test:cov
```

Test examples:

- Theme switching logic
- Authentication state
- Data filtering

### E2E Tests (Playwright)

```bash
npm run test:e2e     # Headless
npm run test:e2e:ui  # Interactive

# Examples in e2e/example.spec.ts
```

Test coverage:

- Landing page display
- Login/Register flows
- Dashboard access control
- Device management
- Chart rendering

---

## 📚 Component Library Integration

**Recommended:** Add shadcn/ui components for production

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button form input
```

Already available in Tailwind config.

---

## 🚢 Deployment Checklist

- [ ] Update API base URL in `.env.production`
- [ ] Verify authentication tokens work
- [ ] Test device connections
- [ ] Ensure HTTPS enabled
- [ ] Setup error tracking (Sentry)
- [ ] Configure analytics
- [ ] Test all themes in production
- [ ] Performance audit
- [ ] Security audit

---

## 📞 Support & Documentation

- **Theme System:** See `src/lib/themes.ts`
- **Mock Data:** See `src/lib/mockData.ts`
- **API Client:** See `src/api/client.ts`
- **Zustand Store:** See `src/store/appStore.ts`
- **Routing:** TanStack Router docs
- **Tech Stack:** See `TECH_STACK.md`

---

## 🎉 You're Ready!

The complete application is now ready with:
✅ Multi-theme support  
✅ Complete auth flow  
✅ Mock dashboard with real analytics  
✅ Device management  
✅ Pre-commit hooks  
✅ Type safety throughout  
✅ Production-ready structure

**Start development:**

```bash
npm run dev
```

Visit: http://localhost:3000
