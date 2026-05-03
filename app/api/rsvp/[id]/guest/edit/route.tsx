import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { auth } from '@/app/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    // Require authentication for editing guest information
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: inviteId } = await params;
    const body = await request.json();
    
    const {
      guest_id,
      given_name,
      family_name,
      title,
      is_adult,
      meal,
      rehearsal_guest,
      rehearsal_meal,
      rsvp_status,
    } = body;

    // Validate input
    if (!guest_id || !given_name || !family_name) {
      return NextResponse.json(
        { error: 'guest_id, given_name, and family_name are required' },
        { status: 400 }
      );
    }

    if (typeof guest_id !== 'string' || typeof given_name !== 'string' || typeof family_name !== 'string') {
      return NextResponse.json(
        { error: 'guest_id and names must be strings' },
        { status: 400 }
      );
    }

    if ('new_guest_id' in body || 'uuid' in body || 'id' in body) {
      return NextResponse.json(
        { error: 'Guest UUID is immutable and cannot be edited' },
        { status: 400 }
      );
    }

    if (title !== undefined && title !== null && typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title must be a string if provided' },
        { status: 400 }
      );
    }

    if (meal !== undefined && typeof meal !== 'boolean') {
      return NextResponse.json(
        { error: 'meal must be a boolean if provided' },
        { status: 400 }
      );
    }

    if (rehearsal_guest !== undefined && typeof rehearsal_guest !== 'boolean') {
      return NextResponse.json(
        { error: 'rehearsal_guest must be a boolean if provided' },
        { status: 400 }
      );
    }

    if (rehearsal_meal !== undefined && typeof rehearsal_meal !== 'boolean') {
      return NextResponse.json(
        { error: 'rehearsal_meal must be a boolean if provided' },
        { status: 400 }
      );
    }

    if (rsvp_status !== undefined && !['pending', 'accepted', 'declined'].includes(rsvp_status)) {
      return NextResponse.json(
        { error: 'rsvp_status must be pending, accepted, or declined' },
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
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    // Verify guest exists and belongs to the invite
    const [guestCheck] = await pool.query(
      'SELECT guest_id FROM guests WHERE guest_id = ? AND invite_id = ?',
      [guest_id, inviteId]
    );

    if (!Array.isArray(guestCheck) || guestCheck.length === 0) {
      return NextResponse.json(
        { error: 'Guest not found for this invite' },
        { status: 404 }
      );
    }

    // Update guest information
    await pool.query(
      `UPDATE guests SET given_name = ?, family_name = ?, title = ?, is_adult = ?, meal = ?, rehearsal_guest = ?, rehearsal_meal = ?,
        rsvp_status = COALESCE(?, rsvp_status)
       WHERE guest_id = ?`,
      [trimmedGivenName, trimmedFamilyName, trimmedTitle, is_adult, meal ?? null, rehearsal_guest ?? null, rehearsal_meal ?? null,
       rsvp_status ?? null, guest_id]
    );

    return NextResponse.json({ message: 'Guest information updated successfully' });
  } catch (error) {
    console.error('Error updating guest information:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating guest information' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication for adding new guests
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inviteId } = await params;
    const body = await request.json();
    
    const { given_name, family_name, title, is_adult, meal } = body;

    // Validate input
    if (!given_name || !family_name) {
      return NextResponse.json(
        { error: 'given_name and family_name are required' },
        { status: 400 }
      );
    }

    if (meal !== undefined && typeof meal !== 'boolean') {
      return NextResponse.json(
        { error: 'meal must be a boolean if provided' },
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
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    // Insert new guest information
    await pool.query(
      'INSERT INTO guests (invite_id, given_name, family_name, title, is_adult, meal) VALUES (?, ?, ?, ?, ?, ?)',
      [inviteId, trimmedGivenName, trimmedFamilyName, trimmedTitle, is_adult, meal]
    );

    return NextResponse.json({ message: 'Guest information added successfully' });
  } catch (error) {
    console.error('Error adding guest information:', error);
    return NextResponse.json(
      { error: 'An error occurred while adding guest information' },
      { status: 500 }
    );
  }
}