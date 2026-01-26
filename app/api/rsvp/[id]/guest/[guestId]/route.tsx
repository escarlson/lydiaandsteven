import { NextRequest, NextResponse } from 'next/server';
import { updateGuestName } from '@/app/lib/rsvp-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    // Await params first
    const { guestId } = await params;
    
    const body = await request.json();
    const { given_name, family_name, title } = body;

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

    if (title !== undefined && title !== null && typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title must be a string if provided' },
        { status: 400 }
      );
    }

    const trimmedGivenName = given_name.trim();
    const trimmedFamilyName = family_name.trim();
    const trimmedTitle = title !== undefined && title !== null ? title.trim() : null;

    if (!trimmedGivenName || !trimmedFamilyName) {
      return NextResponse.json(
        { error: 'Names cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedTitle && trimmedTitle.length > 50) {
      return NextResponse.json(
        { error: 'Title must be 50 characters or fewer' },
        { status: 400 }
      );
    }

    // Update the guest name
    const success = await updateGuestName(
      guestId,
      trimmedGivenName,
      trimmedFamilyName,
      trimmedTitle
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
      title: trimmedTitle,
    });
  } catch (error) {
    console.error('Error updating guest name:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}