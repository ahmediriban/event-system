import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/event.dto';
import { RsvpDto } from './dto/rsvp.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidation } from '../common/decorators/zod-validation.decorator';
import { 
  PaginationQuerySchema, 
  type PaginationQuery,
  type EventListResponse,
  type EventResponse,
  type SuccessResponse,
  CancelRsvpSchema,
  CreateEventSchema,
  CreateRsvpSchema
} from '@event-system/schema';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<EventListResponse> {
    const { page = 1, limit = 10 } = PaginationQuerySchema.parse(query);
    return this.eventsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponse> {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ZodValidation(CreateEventSchema) createEventDto: CreateEventDto, 
    @Request() req: RequestWithUser
  ): Promise<EventResponse> {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Post(':id/rsvp')
  async rsvp(
    @Param('id') id: string, 
    @ZodValidation(CreateRsvpSchema) rsvpDto: RsvpDto
  ) {
    return this.eventsService.rsvp(id, rsvpDto);
  }

  @Delete(':id/rsvp')
  async cancelRsvp(
    @Param('id') id: string,
    @ZodValidation(CancelRsvpSchema) body: { userEmail: string },
  ): Promise<SuccessResponse> {
    return this.eventsService.cancelRsvp(id, body.userEmail);
  }
} 