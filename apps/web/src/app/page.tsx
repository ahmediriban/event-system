import { Suspense } from 'react';
import { serverApi } from '@/lib/server-api';
import { EventsList } from '@/components/events/events-list';
import { Spinner } from '@/components/ui/spinner';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 9;

  try {
    const events = await serverApi.getAll(page, limit);
    
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <EventsList initialEvents={events} initialPage={page} />
      </Suspense>
    );
  } catch (error) {
    console.error('Home page error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: Failed to load events</div>
      </div>
    );
  }
}
