import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { auth } from '@/app/lib/auth';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    
    const { guest_id, given_name, family_name, title, is_adult, food_eater } = body;

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

    if (!UUID_V4_PATTERN.test(guest_id)) {
      return NextResponse.json(
        { error: 'guest_id must be a valid UUID' },
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

    if (food_eater !== undefined && typeof food_eater !== 'boolean') {
      return NextResponse.json(
        { error: 'food_eater must be a boolean if provided' },
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
      'UPDATE guests SET given_name = ?, family_name = ?, title = ?, is_adult = ?, food_eater = ? WHERE guest_id = ?',
      [trimmedGivenName, trimmedFamilyName, trimmedTitle, is_adult, food_eater, guest_id]
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
    
    const { given_name, family_name, title, is_adult, food_eater } = body;

    // Validate input
    if (!given_name || !family_name) {
      return NextResponse.json(
        { error: 'given_name and family_name are required' },
        { status: 400 }
      );
    }

    if (food_eater !== undefined && typeof food_eater !== 'boolean') {
      return NextResponse.json(
        { error: 'food_eater must be a boolean if provided' },
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
      'INSERT INTO guests (invite_id, given_name, family_name, title, is_adult, food_eater) VALUES (?, ?, ?, ?, ?, ?)',
      [inviteId, trimmedGivenName, trimmedFamilyName, trimmedTitle, is_adult, food_eater]
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