'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type EventResponse } from '@event-system/schema';

interface EventCardProps {
  event: EventResponse;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
          <CardDescription className="line-clamp-3">{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-gray-500 space-y-1">
            <p className="flex items-center gap-2">
              <span className="font-medium">Date:</span>
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Location:</span>
              <span className="line-clamp-1">{event.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Attendees:</span>
              <span>{event._count.rsvps}/{event.maxAttendees}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Created by:</span>
              <span className="line-clamp-1">{event.creator.name}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 