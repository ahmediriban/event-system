import { CreateRsvpSchema, type CreateRsvp } from '@event-system/schema';

export class RsvpDto implements CreateRsvp {
  userEmail: string;
  userName: string;
}

// Export the Zod schema for validation
export { CreateRsvpSchema };