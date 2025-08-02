import { AxiosError } from 'axios';
import { api, ApiError, handleApiError } from './api';
import { 
  type CreateEvent, 
  type EventResponse, 
  type EventListResponse,
  type CreateRsvp,
  type SuccessResponse,
  Rsvp
} from '@event-system/schema';

// Events API functions
export const eventsApi = {
  // Get all events with pagination
  getAll: async (page: number = 1, limit: number = 10): Promise<EventListResponse> => {
    try {
      const response = await api.get<EventListResponse>(`/events?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Get user's created events with pagination
  getMyEvents: async (page: number = 1, limit: number = 10): Promise<EventListResponse> => {
    try {
      const response = await api.get<EventListResponse>(`/events/my-events?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Get single event by ID
  getById: async (id: string): Promise<EventResponse> => {
    try {
      const response = await api.get<EventResponse>(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Create new event
  create: async (eventData: CreateEvent): Promise<EventResponse> => {
    try {
      const response = await api.post<EventResponse>('/events', eventData);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },

  // RSVP to an event
  rsvp: async (eventId: string, rsvpData: CreateRsvp): Promise<{ rsvp: Rsvp }> => {
    try {
      const response = await api.post(`/events/${eventId}/rsvp`, rsvpData);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },

  // Delete RSVP
  deleteRsvp: async (eventId: string, userEmail: string): Promise<SuccessResponse> => {
    try {
      const response = await api.delete<SuccessResponse>(`/events/${eventId}/rsvp`, {
        data: { userEmail }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ApiError>);
    }
  },
}; 