# Event Management System

A full-stack event management system with Next.js frontend and NestJS backend.

## Prerequisites

- Node.js 18+ 
- pnpm 10.8.1+
- Docker & Docker Compose

## Quick Setup

### 1. Setup Environment Variables
Copy the example environment files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 2. Install And Build Dependencies
```bash
pnpm install && pnpm build
```

### 3. Start Database
```bash
docker-compose up postgres -d
```

### 4. Setup Database
```bash
# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Seed database
pnpm db:seed
```

### 6. Start Development Servers
```bash
# Start both API and Web apps
pnpm dev
```

The applications will be available at:
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001

## Live Demo

- **Frontend**: [https://event-system-web.vercel.app/](https://event-system-web.vercel.app/)
- **Backend API**: [https://event-system-production.up.railway.app/](https://event-system-production.up.railway.app/)


## API Documentation

Base URL: `http://localhost:3001`

### Authentication

#### POST `/auth/login`
Login with email and password.
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### POST `/auth/logout`
Logout (client handles token removal).
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Events

#### GET `/events`
Get all events with pagination.
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "Event Title",
      "description": "Event Description",
      "date": "2024-01-01T00:00:00.000Z",
      "location": "Event Location",
      "maxAttendees": 100,
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "user_id",
        "name": "Creator Name",
        "email": "creator@example.com"
      },
      "rsvps": [],
      "_count": {
        "rsvps": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET `/events/my-events`
Get events created by the authenticated user (requires authentication).
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** Same as `/events`

#### GET `/events/:id`
Get a specific event by ID.
**Response:** Same as single event object from `/events`

#### POST `/events`
Create a new event (requires authentication).
**Headers:** `Authorization: Bearer <token>`
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "date": "2024-01-01T00:00:00.000Z",
  "location": "Event Location",
  "maxAttendees": 100
}
```

### RSVP

#### POST `/events/:id/rsvp`
RSVP to an event.
```json
{
  "userEmail": "attendee@example.com",
  "userName": "Attendee Name"
}
```

#### DELETE `/events/:id/rsvp`
Cancel RSVP for an event.
```json
{
  "userEmail": "attendee@example.com"
}
```
**Response:**
```json
{
  "message": "RSVP deleted successfully"
}
```

## Architecture Notes

### Technology Choices

**Monorepo with pnpm**: Simplifies dependency management and enables code sharing between frontend and backend.

**Shared Schema Package**: Zod schemas ensure type safety and validation consistency across Next.js and NestJS.

**NextAuth.js**: Better session management and security compared to simple JWT tokens.

### Future Improvements

- Real-time features with WebSockets
- Comprehensive testing coverage
- Enhanced security with rate limiting
- CI/CD pipeline implementation

