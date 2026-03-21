import { NextResponse } from 'next/server';
import { fetchRsvpSummary } from '@/app/lib/rsvp-server';
import { auth } from '@/app/lib/auth';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const summary = await fetchRsvpSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching RSVP summary:', error);
    return NextResponse.json({ error: 'Failed to fetch RSVP summary' }, { status: 500 });
  }
}
