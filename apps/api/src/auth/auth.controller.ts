import { Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ZodValidation } from '../common/decorators/zod-validation.decorator';
import { LoginUserSchema, type AuthResponse } from '@event-system/schema';
import { JwtAuthGuard } from './jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@ZodValidation(LoginUserSchema) loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // JWT tokens are stateless, so we just return success
    // The client will handle clearing the cookie
    return { message: 'Logged out successfully' };
  }
} 