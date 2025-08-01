import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'admin@eventsystem.com' },
    update: {},
    create: {
      email: 'admin@eventsystem.com',
      name: 'Admin User',
      password: 'admin123', 
    },
  });

  console.log('✅ User created:', user.email);

  // Create events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.',
        date: new Date('2024-06-15T09:00:00Z'),
        location: 'San Francisco Convention Center',
        maxAttendees: 500,
        createdBy: user.id,
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-2' },
      update: {},
      create: {
        id: 'event-2',
        title: 'Startup Meetup',
        description: 'Monthly meetup for startup founders and entrepreneurs to share ideas and network.',
        date: new Date('2024-05-20T18:00:00Z'),
        location: 'Downtown Innovation Hub',
        maxAttendees: 100,
        createdBy: user.id,
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-3' },
      update: {},
      create: {
        id: 'event-3',
        title: 'Design Workshop',
        description: 'Hands-on workshop on modern design principles and tools for web and mobile applications.',
        date: new Date('2024-07-10T10:00:00Z'),
        location: 'Creative Studio Space',
        maxAttendees: 50,
        createdBy: user.id,
      },
    }),
  ]);

  console.log('✅ Events created:', events.map(e => e.title));

  // Create some sample RSVPs
  const rsvps = await Promise.all([
    prisma.rSVP.upsert({
      where: { 
        eventId_userEmail: {
          eventId: events[0].id,
          userEmail: 'john.doe@example.com'
        }
      },
      update: {},
      create: {
        eventId: events[0].id,
        userEmail: 'john.doe@example.com',
        userName: 'John Doe',
      },
    }),
    prisma.rSVP.upsert({
      where: { 
        eventId_userEmail: {
          eventId: events[0].id,
          userEmail: 'jane.smith@example.com'
        }
      },
      update: {},
      create: {
        eventId: events[0].id,
        userEmail: 'jane.smith@example.com',
        userName: 'Jane Smith',
      },
    }),
    prisma.rSVP.upsert({
      where: { 
        eventId_userEmail: {
          eventId: events[1].id,
          userEmail: 'bob.wilson@example.com'
        }
      },
      update: {},
      create: {
        eventId: events[1].id,
        userEmail: 'bob.wilson@example.com',
        userName: 'Bob Wilson',
      },
    }),
  ]);

  console.log('✅ RSVPs created:', rsvps.length, 'total');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e: Error) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 