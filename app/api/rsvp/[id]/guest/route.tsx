import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inviteId } = await params;
    const body = await request.json();
    
    const { given_name, family_name, title, is_adult = false } = body;

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

    // Verify invite exists
    const [inviteCheck] = await pool.query(
      'SELECT invite_id FROM invites WHERE invite_id = ?',
      [inviteId]
    );
    
    if (!Array.isArray(inviteCheck) || inviteCheck.length === 0) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Create new guest
    const guestId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO guests (guest_id, invite_id, title, given_name, family_name, rsvp_status, is_adult)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [guestId, inviteId, trimmedTitle, trimmedGivenName, trimmedFamilyName, is_adult ? 1 : 0]
    );

    return NextResponse.json({
      success: true,
      guest: {
        guest_id: guestId,
        title: trimmedTitle,
        given_name: trimmedGivenName,
        family_name: trimmedFamilyName,
        rsvp_status: 'pending',
        is_adult,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding guest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
