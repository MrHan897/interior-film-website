import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      supabase: {
        url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon_key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        service_key_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      api_routes: {
        '/api/health': 'active',
        '/api/tasks': 'available',
        '/api/events': 'available',
        '/api/portfolio': 'available',
        '/api/bookings': 'available'
      },
      pages: {
        '/': 'available',
        '/booking': 'available',
        '/admin/schedule': 'available',
        '/admin/portfolio': 'available'
      }
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}