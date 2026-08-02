import { NextResponse } from 'next/server';
import { fetchRsvpSummary, fetchMealSummary } from '@/app/lib/rsvp-server';
import { auth } from '@/app/lib/auth';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const [summary, foodEaters] = await Promise.all([fetchRsvpSummary(), fetchMealSummary()]);
    return NextResponse.json({ ...summary, foodEaters });
  } catch (error) {
    console.error('Error fetching RSVP summary:', error);
    return NextResponse.json({ error: 'Failed to fetch RSVP summary' }, { status: 500 });
  }
}
