import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoginUserSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

// Auth response schemas
export const AuthResponseSchema = z.object({
  access_token: z.string(),
  user: UserResponseSchema,
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>; 