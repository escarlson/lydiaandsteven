import { NextRequest, NextResponse } from 'next/server';
import { updateGuestName } from '@/app/lib/rsvp-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    // Await params first
    const { id: inviteId, guestId } = await params;
    
    const body = await request.json();
    const { given_name, family_name } = body;

    // Validate input
    if (!given_name || !family_name) {
      return NextResponse.json(
        { error: 'Both given_name and family_name are required' },
        { status: 400 }
      );
    }

    if (typeof given_name !== 'string' || typeof family_name !== 'string') {
      return NextResponse.json(
        { error: 'Names must be strings' },
        { status: 400 }
      );
    }

    const trimmedGivenName = given_name.trim();
    const trimmedFamilyName = family_name.trim();

    if (!trimmedGivenName || !trimmedFamilyName) {
      return NextResponse.json(
        { error: 'Names cannot be empty' },
        { status: 400 }
      );
    }

    // Update the guest name
    const success = await updateGuestName(
      guestId,
      trimmedGivenName,
      trimmedFamilyName
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Guest not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guest_id: guestId,
      given_name: trimmedGivenName,
      family_name: trimmedFamilyName,
    });
  } catch (error) {
    console.error('Error updating guest name:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}