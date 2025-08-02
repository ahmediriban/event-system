import { CreateEventSchema, type CreateEvent } from '@event-system/schema';

export class CreateEventDto implements CreateEvent {
  title: string;
  description: string;
  date: string; 
  location: string;
  maxAttendees: number;
}

// Export the Zod schema for validation
export { CreateEventSchema };