import { z } from 'zod';

// Pagination schemas
export const PaginationQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

export const PaginationResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

// Error response schemas
export const ErrorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string().optional(),
});

// Success response schemas
export const SuccessResponseSchema = z.object({
  message: z.string(),
});

// Type exports
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>; 