import { z } from 'zod';

// Event schemas
export const EventSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.date(),
  location: z.string().min(1),
  maxAttendees: z.number().int().positive(),
  createdBy: z.string().cuid(),
  createdAt: z.date(),
});

// RSVP schemas
export const RsvpSchema = z.object({
  id: z.string().cuid(),
  eventId: z.string().cuid(),
  userEmail: z.string().email(),
  userName: z.string().min(1),
  createdAt: z.date(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime('Date must be a valid ISO date string'),
  location: z.string().min(1, 'Location is required'),
  maxAttendees: z.number().int().positive('Max attendees must be a positive number'),
});

export const EventResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  location: z.string(),
  maxAttendees: z.number(),
  createdBy: z.string(),
  createdAt: z.date(),
  creator: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  rsvps: z.array(RsvpSchema),
  _count: z.object({
    rsvps: z.number(),
  }),
});

export const EventListResponseSchema = z.object({
  events: z.array(EventResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

export const CreateRsvpSchema = z.object({
  userEmail: z.string().email('Please provide a valid email address'),
  userName: z.string().min(1, 'User name is required'),
});

export const DeleteRsvpSchema = z.object({
  userEmail: z.string().email('Please provide a valid email address'),
});

// Type exports
export type Event = z.infer<typeof EventSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type EventResponse = z.infer<typeof EventResponseSchema>;
export type EventListResponse = z.infer<typeof EventListResponseSchema>;
export type Rsvp = z.infer<typeof RsvpSchema>;
export type CreateRsvp = z.infer<typeof CreateRsvpSchema>;
export type DeleteRsvp = z.infer<typeof DeleteRsvpSchema>; 