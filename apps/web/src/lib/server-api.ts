import { type EventListResponse } from '@event-system/schema';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// Server-side API functions
export const serverApi = {
  // Get all events
  getAll: async (page: number = 1, limit: number = 9): Promise<EventListResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Server API error:', error);
      throw new Error('Failed to fetch events');
    }
  },
}; 