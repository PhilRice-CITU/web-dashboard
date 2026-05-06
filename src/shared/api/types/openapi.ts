/**
 * OpenAPI Types
 *
 * These types are auto-generated from your OpenAPI schema.
 * To generate them:
 *
 * 1. Install openapi-typescript:
 *    npm install -D openapi-typescript
 *
 * 2. Generate types from your OpenAPI schema:
 *    npx openapi-typescript https://api.example.com/openapi.json -o src/api/types/openapi.ts
 *
 *    OR for a local schema:
 *    npx openapi-typescript ./openapi.json -o src/api/types/openapi.ts
 *
 * 3. Use with openapi-fetch client:
 *    import { apiClient } from '@/api/client'
 *
 * Example API call:
 * ```
 * const { data, error } = await apiClient.GET('/api/users/{id}', {
 *   params: { path: { id: userId } }
 * });
 * ```
 */

export type paths = Record<string, never>
