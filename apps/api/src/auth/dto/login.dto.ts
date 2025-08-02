import { LoginUserSchema, type LoginUser } from '@event-system/schema';

export class LoginDto implements LoginUser {
  email: string;
  password: string;
}

// Export the Zod schema for validation
export { LoginUserSchema };
