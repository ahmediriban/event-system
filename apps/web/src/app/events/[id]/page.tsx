import { EventDetail } from '@/components/events/event-detail';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  return <EventDetail eventId={resolvedParams.id} />;
} 