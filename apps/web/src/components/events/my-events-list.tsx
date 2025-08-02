'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { ApiError, eventsApi } from '@/lib';
import { type EventListResponse } from '@event-system/schema';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { EventCard } from './event-card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function MyEventsList() {
  const [events, setEvents] = useState<EventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      loadMyEvents();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, currentPage]);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getMyEvents(currentPage, limit);
      setEvents(data);
    } catch (err: unknown) {
      const ApiError = err as ApiError;
      setError(ApiError.message as string);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const renderPaginationItems = () => {
    if (!events?.pagination) return null;

    const { page, pages } = events.pagination;
    const items = [];

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) handlePageChange(page - 1);
          }}
          className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    );

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={i === page}
            onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page and ellipsis
    if (endPage < pages) {
      if (endPage < pages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={pages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(pages); }}>
            {pages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page < pages) handlePageChange(page + 1);
          }}
          className={page >= pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    );

    return items;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Events</h1>
          <Button onClick={handleCreateEvent} className="flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
        </div>

        {events && events.events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">You haven&apos;t created any events yet.</div>
            <Button onClick={handleCreateEvent} className="cursor-pointer">
              Create Your First Event
            </Button>
          </div>
        ) : (
          <>
            {events && (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {events && events.pagination && events.pagination.pages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {renderPaginationItems()}
                  </PaginationContent>
                </Pagination>
                <div className="mt-4 text-center text-sm text-gray-600">
                  Page {events.pagination.page} of {events.pagination.pages} 
                  &nbsp;({events.pagination.total} total events)
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 