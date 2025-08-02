import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/event.dto';
import { RsvpDto } from './dto/rsvp.dto';


@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          rsvps: true,
          _count: {
            select: {
              rsvps: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      this.prisma.event.count(),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findMyEvents(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          createdBy: userId,
        },
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          rsvps: true,
          _count: {
            select: {
              rsvps: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      this.prisma.event.count({
        where: {
          createdBy: userId,
        },
      }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rsvps: true,
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(createEventDto: CreateEventDto, userId: string) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date), 
        createdBy: userId,
      },
      include: {
        rsvps: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    });
  }

  async rsvp(eventId: string, rsvpDto: RsvpDto) {
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event is full
    if (event._count.rsvps >= event.maxAttendees) {
      throw new BadRequestException('Event is full');
    }

    // Check if user already RSVP'd
    const existingRsvp = await this.prisma.rSVP.findUnique({
      where: {
        eventId_userEmail: {
          eventId,
          userEmail: rsvpDto.userEmail,
        },
      },
    });

    if (existingRsvp) {
      throw new BadRequestException('User already RSVP\'d to this event');
    }

    return this.prisma.rSVP.create({
      data: {
        eventId,
        userEmail: rsvpDto.userEmail,
        userName: rsvpDto.userName,
      },
    });
  }

  async deleteRsvp(eventId: string, userEmail: string) {
    const rsvp = await this.prisma.rSVP.findUnique({
      where: {
        eventId_userEmail: {
          eventId,
          userEmail,
        },
      },
    });

    if (!rsvp) {
      throw new NotFoundException('RSVP not found');
    }

    await this.prisma.rSVP.delete({
      where: {
        eventId_userEmail: {
          eventId,
          userEmail,
        },
      },
    });

    return { message: 'RSVP deleted successfully' };
  }
} 