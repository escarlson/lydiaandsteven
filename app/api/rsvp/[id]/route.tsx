import { NextResponse } from "next/server";
import pool from '../../../lib/db';

console.log("API route loaded");

// InviteGuestRow includes data from both invites and guests tables
type InviteGuestRow = {
  invite_id: string;
  household_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_province: string;
  invite_postal_code: string;
  country: string;
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
         i.address_line1,
         i.address_line2,
         i.city,
         i.state_province,
         i.postal_code AS invite_postal_code,
         i.country,
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
          address_line1: r.address_line1,
          address_line2: r.address_line2,
          city: r.city,
          state_province: r.state_province,
          postal_code: r.invite_postal_code,
          country: r.country,
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