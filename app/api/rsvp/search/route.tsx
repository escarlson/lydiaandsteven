import { NextResponse } from "next/server";
import pool from '../../../lib/db';

// InviteGuestRow includes data from both invites and guests tables
type InviteGuestRow = {
  invite_id: string;
  household_name: string;
  invite_postal_code: string;
  sent_at: Date | null;
  guest_id: string;
  title: string | null;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult: number | boolean;
  guest_created_at: Date;
  guest_updated_at: Date;
};

// Helper function to strip honorific titles from names
function stripHonorific(name: string): string {
  // Match common honorifics at the start, with optional period and required space
  const honorificPattern = /^(mr\.?|mrs\.?|ms\.?|miss\.?|dr\.?|rev\.?|fr\.?|sr\.?|br\.?|prof\.?|kh\.?|dk\.?|sh\.?|dn\.?)\s+/i;
  return name.trim().replace(honorificPattern, '');
}

// use GET request with query parameters for searching RSVPs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const givenNameQuery = stripHonorific(searchParams.get("givenName")?.trim() ?? "");
  const familyNameQuery = searchParams.get("familyName")?.trim() ?? "";
  const postalCodeQuery = searchParams.get("postalCode")?.trim() ?? "";

  try {
    // find invites joined to any matching guests (case-insensitive on guest fields)
    const [result] = await pool.query(
      `SELECT
         i.invite_id,
         i.household_name,
         i.postal_code AS invite_postal_code,
         i.sent_at,
         g.guest_id,
         g.title,
         g.given_name,
         g.family_name,
         g.rsvp_status,
         g.is_adult,
         g.created_at AS guest_created_at,
         g.updated_at AS guest_updated_at
       FROM invites i
       JOIN guests g ON i.invite_id = g.invite_id
       WHERE LOWER(TRIM(g.given_name)) = LOWER(?)
         AND LOWER(TRIM(g.family_name)) = LOWER(?)
         AND LOWER(TRIM(i.postal_code)) = LOWER(?)`,
      [givenNameQuery, familyNameQuery, postalCodeQuery]
    );
    const rows = result as InviteGuestRow[];

    // if the query matched guests that belong to multiple distinct invites, treat this as ambiguous and return an error
    const inviteIds = new Set(rows.map(r => r.invite_id));
    if (inviteIds.size > 1) {
      console.error("Multiple invitations found for one query", { givenName: givenNameQuery, familyName: familyNameQuery, postalCode: postalCodeQuery, invite_ids: Array.from(inviteIds) });
      return NextResponse.json({ error: "Multiple invitations found for that guest", invite_ids: Array.from(inviteIds) }, { status: 409 });
    }
    if (inviteIds.size === 0) {
      console.error("No matching invitations found", { givenName: givenNameQuery, familyName: familyNameQuery, postalCode: postalCodeQuery });
      return NextResponse.json({ error: "No invitation found matching that information" }, { status: 404 });
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
        title: r.title,
        given_name: r.given_name,
        family_name: r.family_name,
        rsvp_status: r.rsvp_status,
        is_adult: !!r.is_adult,
        created_at: r.guest_created_at,
        updated_at: r.guest_updated_at,
      });
    }

    const results = Array.from(invitesMap.values());
    return NextResponse.json({ results }, { status: 200 });
  } catch (error: unknown) {
    console.error("Database query error:", error);
    // If the DB connection was refused, return 503 Service Unavailable
    if (error instanceof Error && 'code' in error && error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Database connection refused" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}