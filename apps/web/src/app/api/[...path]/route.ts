import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const method = request.method;
  
  try {
    const path = resolvedParams.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // If we have a session with access token, use it for the NestJS backend
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };
    
    // Add body for POST, PUT, DELETE requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const body = await request.text();
      if (body) {
        requestOptions.body = body;
      }
    }
    
    // Make request to NestJS API
    const apiUrl = `${API_BASE_URL}/${path}${queryString}`;
    const response = await fetch(apiUrl, requestOptions);
    
    const data = await response.json();
    
    // Create Next.js response
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    return nextResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: 'Server Error',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as DELETE };
export { handler as PATCH };
export { handler as OPTIONS };
export { handler as HEAD }; 