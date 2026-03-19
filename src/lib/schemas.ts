import { z } from 'zod'

/**
 * Validation schemas using Zod
 * Use these with react-hook-form for type-safe form validation
 */

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'viewer']),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
