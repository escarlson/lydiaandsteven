import { NextResponse } from "next/server";
import pool from '../../../lib/db';
import { updateGuestRSVP } from '../../../lib/rsvp-server';

console.log("API route loaded");

// InviteGuestRow includes data from both invites and guests tables
type InviteGuestRow = {
  invite_id: string;
  household_name: string;
  invite_postal_code: string;
  sent_at: Date | null;
  guest_id: string;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult: number | boolean;
  seat_requested: number | boolean;
  guest_created_at: Date;
  guest_updated_at: Date;
};

// use GET request with query parameters for searching RSVPs
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const urlParams = await params;
  const inviteIdQuery = urlParams.id;
  console.log("Received GET request with inviteIdQuery:", inviteIdQuery);

  try {
    // find invites joined to any matching guests (case-insensitive on guest fields)
    const [result] = await pool.query(
      `SELECT
         i.invite_id,
         i.household_name,
         i.postal_code AS invite_postal_code,
         i.sent_at,
         g.guest_id,
         g.given_name,
         g.family_name,
         g.rsvp_status,
         g.is_adult,
         g.seat_requested,
         g.created_at AS guest_created_at,
         g.updated_at AS guest_updated_at
       FROM invites i
       JOIN guests g ON i.invite_id = g.invite_id
       WHERE LOWER(i.invite_id) = LOWER(?)`,
      [inviteIdQuery]
    );
    const rows = result as InviteGuestRow[];

    // if the query matched guests that belong to multiple distinct invites, treat this as ambiguous and return an error
    const inviteIds = new Set(rows.map(r => r.invite_id));
    if (inviteIds.size > 1) {
      return NextResponse.json({ error: "Multiple invitations found with that ID", invite_ids: Array.from(inviteIds) }, { status: 409 });
    }
    if (inviteIds.size === 0) {
      return NextResponse.json({ error: "No invitation found with that ID" }, { status: 404 });
    }

    // group rows by invite_id so each invite has a `guests` array
    const invitesMap = new Map();
    for (const r of rows) {
      const id = r.invite_id;
      if (!invitesMap.has(id)) {
        invitesMap.set(id, {
          invite_id: r.invite_id,
          household_name: r.household_name,
          postal_code: r.invite_postal_code,
          sent_at: r.sent_at,
          guests: [],
        });
      }

      invitesMap.get(id).guests.push({
        guest_id: r.guest_id,
        given_name: r.given_name,
        family_name: r.family_name,
        rsvp_status: r.rsvp_status,
        is_adult: !!r.is_adult,
        seat_requested: !!r.seat_requested,
        created_at: r.guest_created_at,
        updated_at: r.guest_updated_at,
      });
    }

    const results = Array.from(invitesMap.values());
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const urlParams = await params;
  const inviteId = urlParams.id;

  try {
    // creation flow: POST to /api/rsvp/create will create a new invitation + guests
    if (inviteId === 'create') {
      const contentType = request.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return NextResponse.json({ error: 'JSON body required for invite creation' }, { status: 400 });
      }

      const body = await request.json().catch(() => ({}));
      const household_name = (body.household_name ?? '').toString().trim();
      const guests = Array.isArray(body.guests) ? body.guests : [];

      if (!household_name) {
        return NextResponse.json({ error: 'household_name is required' }, { status: 400 });
      }
      if (!guests.length) {
        return NextResponse.json({ error: 'guests array is required and must contain at least one guest' }, { status: 400 });
      }

      // validate guests minimally
      for (const g of guests) {
        if (!g?.given_name || !g?.family_name) {
          return NextResponse.json({ error: 'Each guest must include given_name and family_name' }, { status: 400 });
        }
        if (g.rsvp_status && !['pending', 'accepted', 'declined'].includes(g.rsvp_status)) {
          return NextResponse.json({ error: 'Invalid rsvp_status on guest' }, { status: 400 });
        }
      }

      // create invite + guests in a transaction
      const inviteIdNew = crypto.randomUUID();
      try {
        await pool.query('START TRANSACTION');

        await pool.query(
          `INSERT INTO invites (invite_id, household_name, postal_code)
           VALUES (?, ?, ?)`,
          [
            inviteIdNew,
            body.household_name ?? null,
            body.postal_code ?? null,
          ]
        );

        const createdGuests = [];
        for (const g of guests) {
          const guestIdNew = crypto.randomUUID();
          const rsvp_status = g.rsvp_status ?? 'pending';
          const is_adult = (typeof g.is_adult === 'boolean') ? g.is_adult : true;
          const seat_requested = (typeof g.seat_requested === 'boolean') ? g.seat_requested : false;

          await pool.query(
            `INSERT INTO guests (guest_id, invite_id, given_name, family_name, rsvp_status, is_adult, seat_requested)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [guestIdNew, inviteIdNew, g.given_name, g.family_name, rsvp_status, is_adult ? 1 : 0, seat_requested ? 1 : 0]
          );

          createdGuests.push({
            guest_id: guestIdNew,
            given_name: g.given_name,
            family_name: g.family_name,
            rsvp_status,
            is_adult,
            seat_requested,
          });
        }

        await pool.query('COMMIT');

        const invite = {
          invite_id: inviteIdNew,
          household_name: body.household_name,
          postal_code: body.postal_code ?? null,
          guests: createdGuests,
        };

        return NextResponse.json({ success: true, invite }, { status: 201 });
      } catch (err) {
        await pool.query('ROLLBACK').catch(() => { /* ignore rollback error */ });
        console.error('Error creating invite and guests:', err);
        return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
      }
    }

    // existing update RSVP flow
    const contentType = request.headers.get('content-type') || '';
    let guestId: string | null = null;
    let rsvpStatus: string | null = null;

    if (contentType.includes('application/json')) {
      const json = await request.json();
      guestId = json.guest_id?.toString() || null;
      rsvpStatus = json.rsvp_status || null;
    } else {
      const form = await request.formData();
      guestId = form.get('guest_id')?.toString() || null;
      rsvpStatus = form.get('rsvp_status')?.toString() || null;
    }

    if (!guestId || !rsvpStatus) {
      return NextResponse.json({ error: 'guest_id and rsvp_status are required' }, { status: 400 });
    }

    const allowed = ['accepted', 'declined'];
    if (!allowed.includes(rsvpStatus)) {
      return NextResponse.json({ error: 'Invalid rsvp_status' }, { status: 400 });
    }

    await updateGuestRSVP(guestId, rsvpStatus as 'accepted' | 'declined');

    // If the client sent JSON (AJAX), return JSON so the client can update without a redirect
    if (contentType.includes('application/json')) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // otherwise redirect back to the invite page so the user sees updated status
    const redirectUrl = new URL(`/rsvp/${inviteId}`, request.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error('Error processing RSVP POST', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}