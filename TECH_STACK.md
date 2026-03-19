# Tech Stack Boilerplate

## Frontend Stack

| Technology          | Purpose            | Reason                                               |
| ------------------- | ------------------ | ---------------------------------------------------- |
| **TypeScript**      | Type Safety        | Prevents runtime errors, improves DX                 |
| **Vite**            | Build Tool         | Lightning-fast builds and HMR                        |
| **React 19**        | UI Framework       | Modern React with server components support          |
| **TanStack Router** | Routing            | Type-safe routing, file-based routing support        |
| **TanStack Query**  | Data Fetching      | Server state management, caching, background sync    |
| **Zod**             | Schema Validation  | Runtime type checking for forms and API responses    |
| **React Hook Form** | Form Management    | Performant, flexible form handling                   |
| **Shadcn/UI**       | Component Library  | Headless, accessible components built on Radix UI    |
| **Tailwind CSS**    | Styling            | Utility-first CSS, rapid UI development              |
| **Recharts**        | Data Visualization | React-first charts library, easy to customize        |
| **Zustand**         | State Management   | Lightweight global state (for UI state, auth, theme) |
| **OpenAPI Fetch**   | API Client         | Type-safe API calls from OpenAPI specs               |
| **Axios**           | HTTP Client        | Reliable HTTP requests with interceptors             |
| **Playwright**      | E2E Testing        | Cross-browser testing, excellent DX                  |
| **Vitest**          | Unit Testing       | Vite-native testing, fast test runner                |

---

## Project Structure

```
src/
├── api/                    # API client setup and types
│   ├── client.ts          # OpenAPI and Axios clients
│   └── types/
│       └── openapi.ts     # Auto-generated OpenAPI types
├── components/            # React components (organized by feature)
├── hooks/                 # Custom React hooks
│   └── useApi.ts         # API query hooks
├── lib/                  # Utilities
│   ├── utils.ts          # Helper functions
│   └── schemas.ts        # Zod validation schemas
├── providers/            # React context providers
│   └── QueryProvider.tsx # React Query setup
├── routes/               # TanStack Router routes
├── store/                # Zustand stores
│   └── appStore.ts       # Global app state
├── router.tsx            # Router configuration
└── styles.css            # Global styles

e2e/                       # Playwright E2E tests
playwright.config.ts       # Playwright configuration
postcss.config.js         # PostCSS configuration
```

---

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Building

```bash
npm run build
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# E2E tests in UI mode
npm run test:e2e:ui
```

---

## Setup Guide

### 1. **OpenAPI Integration**

Generate types from your OpenAPI schema:

```bash
npm install -D openapi-typescript

# From URL
npx openapi-typescript https://api.example.com/openapi.json -o src/api/types/openapi.ts

# From local file
npx openapi-typescript ./openapi.json -o src/api/types/openapi.ts
```

### 2. **Shadcn/UI Setup**

Initialize shadcn/ui:

```bash
npx shadcn-ui@latest init
```

Add components as needed:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
```

### 3. **Environment Variables**

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

### 4. **API Client Setup**

Update `src/api/client.ts` with your API base URL:

```tsx
const apiClient = createApiClient({
  baseUrl: process.env.VITE_API_BASE_URL,
})
```

### 5. **Forms with Validation**

Example using React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/schemas'

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
    </form>
  )
}
```

### 6. **Data Fetching with React Query**

```tsx
import { useFetch } from '@/hooks/useApi'

export function UsersList() {
  const { data: users, isLoading } = useFetch('/api/users')

  if (isLoading) return <div>Loading...</div>

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### 7. **Global State with Zustand**

```tsx
import { useAppStore } from '@/store/appStore'

export function Header() {
  const { user, logout } = useAppStore()

  return (
    <header>
      <span>{user?.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  )
}
```

---

## Backend Stack Recommendations (NestJS)

### Core Stack

| Technology      | Purpose         | Reason                                       |
| --------------- | --------------- | -------------------------------------------- |
| **NestJS**      | Framework       | Opinionated, scalable, excellent TS support  |
| **PostgreSQL**  | Database        | Robust RDBMS, great ecosystem                |
| **TypeORM**     | ORM             | Type-safe database operations                |
| **Prisma**      | Alternative ORM | Better DX, auto-migration, schema validation |
| **JWT**         | Authentication  | Stateless, scalable auth                     |
| **dotenv**      | Config          | Environment variable management              |
| **Passport.js** | Auth Strategy   | With JWT strategy for token validation       |

### Recommended Setup

```bash
# Create NestJS project
npx @nestjs/cli@latest new api-server

# Install dependencies
npm install @nestjs/jwt passport @nestjs/passport

# Install database
npm install typeorm pg
# OR
npm install @prisma/client
npx prisma init
```

### API Structure

```
api-server/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── jwt.strategy.ts
│   ├── users/             # Users module
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── user.entity.ts
│   ├── common/            # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── guards/
│   ├── app.module.ts
│   └── main.ts
├── .env
└── prisma/                # (if using Prisma)
    └── schema.prisma
```

### OpenAPI/Swagger Integration

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const config = new DocumentBuilder()
  .setTitle('PhilRice API')
  .setVersion('1.0')
  .build()
const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api', app, document)
```

### Authentication Setup

```typescript
// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
};

// In auth.service.ts
async signToken(payload: any) {
  const token = this.jwtService.sign(payload);
  return { access_token: token };
}
```

### Database Setup (Prisma)

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  role  String  @default("user")
}
```

### Deployment Ready Configuration

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/philrice
JWT_SECRET=your-secret-key
NODE_ENV=production
API_PORT=3001
```

---

## Additional Recommendations

### Package Management

- Use **pnpm** instead of npm for faster, more reliable dependency management
- Enable dependency isolation with `shamefully-hoist = false`

### CI/CD

- **GitHub Actions** for automated testing and deployment
- Configure workflows for:
  - Running unit tests
  - Running E2E tests
  - Building Docker images
  - Deploying to production

### Monitoring & Logging

- **Winston** or **Bunyan** for structured logging (NestJS)
- **Sentry** for error tracking
- **LogRocket** for frontend monitoring

### Security

- Use **helmet** for HTTP headers (NestJS)
- Implement **CORS** properly
- Add rate limiting with `@nestjs/throttler`
- Validate all inputs with Zod on frontend + backend validation rules

### Documentation

- Keep OpenAPI specs aligned with implementation
- Use JSDoc comments for complex functions
- Maintain API documentation in `/docs-and-architecture`

---

## Useful Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Interactive E2E test UI

# Quality
npm run lint             # Lint code
npm run check            # Format and lint

# Code Quality
npm run type-check       # TypeScript type checking
```

---

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Zod Docs](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [NestJS Docs](https://docs.nestjs.com)
- [Playwright Docs](https://playwright.dev)
- [Recharts](https://recharts.org)

---

## Next Steps

1. ✅ Set up environment variables (`.env.local`)
2. ✅ Generate OpenAPI types from your backend
3. ✅ Add shadcn/UI components
4. ✅ Create your first page with TanStack Router
5. ✅ Implement authentication with Zustand + API client
6. ✅ Add E2E tests with Playwright
7. ✅ Deploy using your preferred hosting (Vercel, Netlify, Docker)
