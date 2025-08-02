'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { eventsApi, handleApiError } from '@/lib';
import { type EventResponse, CreateRsvpSchema, type CreateRsvp, type Rsvp } from '@event-system/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState<string>('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; rsvp: Rsvp | null }>({
    isOpen: false,
    rsvp: null
  });
  const router = useRouter();

  const form = useForm<CreateRsvp>({
    resolver: zodResolver(CreateRsvpSchema),
    defaultValues: {
      userEmail: '',
      userName: '',
    },
  });

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getById(eventId);
      setEvent(data);
      setRsvps(data.rsvps);
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setError(apiError.message as string);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateRsvp) => {
    setRsvpLoading(true);
    setRsvpError('');
    setRsvpSuccess(false);

    try {
      const response = await eventsApi.rsvp(eventId, data);
      setRsvpSuccess(true);
      form.reset();
      // Add new RSVP to the list using the API response
      if (response.rsvp) {
        setRsvps(prev => [...prev, response.rsvp]);
      }
      // Clear success message after 5 seconds
      setTimeout(() => setRsvpSuccess(false), 5000);
      // Reload event to update attendee count
      await loadEvent();
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setRsvpError(apiError.message as string);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDeleteClick = (rsvp: Rsvp) => {
    setConfirmDelete({ isOpen: true, rsvp });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete.rsvp) return;
    
    const { rsvp } = confirmDelete;
    setDeleteLoading(rsvp.id);
    setRsvpError('');

    try {
      await eventsApi.deleteRsvp(eventId, rsvp.userEmail);
      setRsvps(prev => prev.filter(r => r.id !== rsvp.id));
      setDeleteSuccess(true);
      // Clear success message after 5 seconds
      setTimeout(() => setDeleteSuccess(false), 5000);
      // Reload event to update attendee count
      await loadEvent();
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setRsvpError(apiError.message as string);
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDelete({ isOpen: false, rsvp: null });
  };

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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Event not found</div>
      </div>
    );
  }

  const isEventFull = event._count.rsvps >= event.maxAttendees;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 cursor-pointer"
        >
          ← Back to Events
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl mt-4 leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[80px]">Date:</span>
                      <span className="text-gray-900">{new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[80px]">Location:</span>
                      <span className="text-gray-900">{event.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[80px]">Attendees:</span>
                      <span className="text-gray-900">{event._count.rsvps}/{event.maxAttendees}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[80px]">Created by:</span>
                      <span className="text-gray-900">{event.creator.name}</span>
                    </div>
                  </div>
                </div>

                {isEventPast && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">This event has already passed</p>
                  </div>
                )}

                {isEventFull && !isEventPast && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">This event is full</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RSVP Form */}
          {!isEventPast && !isEventFull && (
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">RSVP for this Event</CardTitle>
                  <CardDescription>
                    {isEventFull 
                      ? 'This event is full'
                      : 'Add your name and email to RSVP for this event'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Mobile layout - stacked fields */}
                      <div className="block lg:hidden space-y-4">
                        <FormField
                          control={form.control}
                          name="userEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Desktop layout - side by side fields */}
                      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
                        <FormField
                          control={form.control}
                          name="userEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <Button 
                            type="submit" 
                            className="w-full cursor-pointer" 
                            disabled={rsvpLoading}
                            size="lg"
                          >
                            {rsvpLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <Spinner size="sm" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              'RSVP'
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Mobile submit button */}
                      <div className="block lg:hidden">
                        <Button 
                          type="submit" 
                          className="w-full cursor-pointer" 
                          disabled={rsvpLoading}
                          size="lg"
                        >
                          {rsvpLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Spinner size="sm" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            'RSVP'
                          )}
                        </Button>
                      </div>

                      {rsvpError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                          {rsvpError}
                        </div>
                      )}

                      {rsvpSuccess && (
                        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                          RSVP successful!
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* RSVP List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Attendees ({rsvps.length})</CardTitle>
                <CardDescription>
                  People who have RSVP&apos;d for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {deleteSuccess && (
                  <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    RSVP deleted successfully!
                  </div>
                )}
                
                {rsvps.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No attendees yet. Be the first to RSVP!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rsvps.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{rsvp.userName}</div>
                          <div className="text-sm text-gray-500">{rsvp.userEmail}</div>
                          <div className="text-xs text-gray-400">
                            RSVP&apos;d on {new Date(rsvp.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(rsvp)}
                          disabled={deleteLoading === rsvp.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          {deleteLoading === rsvp.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete RSVP"
        description={`Are you sure you want to remove ${confirmDelete.rsvp?.userName} from this event? This action cannot be undone.`}
        confirmText="Delete RSVP"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
} 