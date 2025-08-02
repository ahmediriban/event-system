'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { eventsApi, handleApiError } from '@/lib';
import { type CreateEvent, CreateEventSchema } from '@event-system/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';

export function CreateEventForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const form = useForm<CreateEvent>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      maxAttendees: 10,
    },
  });

  const onSubmit = async (data: CreateEvent) => {
    setLoading(true);
    setError('');

    try {
      // Convert local datetime to ISO string for Zod validation
      const eventData = {
        ...data,
        date: new Date(data.date).toISOString()
      };
      
      const response = await eventsApi.create(eventData);
      router.push(`/events/${response.id}`);
      } catch (err: unknown) {
        const apiError = handleApiError(err);
        setError(apiError.message as string);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change to convert to ISO format for validation
  const handleDateChange = (value: string) => {
    if (value) {
      const isoDate = new Date(value).toISOString();
      form.setValue('date', isoDate);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 cursor-pointer"
        >
          ← Back to Events
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Event</CardTitle>
              <CardDescription>
                Fill out the form below to create a new event for your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Event Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a compelling event title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe what your event is about"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date & Time and Location - Side by side on desktop */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date & Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => handleDateChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Where will the event take place?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Maximum Attendees */}
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            className="max-w-xs"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full cursor-pointer" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="sm" />
                        <span>Creating Event...</span>
                      </div>
                    ) : (
                      'Create Event'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 