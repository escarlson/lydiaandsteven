import { NextResponse } from 'next/server';
import { fetchAllInvitationsWithGuests } from '@/app/lib/rsvp-server';
import { auth } from '@/app/lib/auth';

export async function GET(request: Request) {
  // Require authentication to fetch all RSVPs
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const invitations = await fetchAllInvitationsWithGuests();

    return NextResponse.json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error('Error fetching all invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
