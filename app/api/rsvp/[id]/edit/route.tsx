import { NextRequest, NextResponse } from 'next/server';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '@/app/lib/db';
import { auth } from '@/app/lib/auth';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type EditPayload = {
  guest_id?: string;
  given_name?: string;
  family_name?: string;
  title?: string | null;
  is_adult?: boolean;
  food_eater?: string | null;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conn = await pool.getConnection();

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inviteId = params.id;
    if (!UUID_V4_PATTERN.test(inviteId)) {
      return NextResponse.json({ error: 'Invalid invitation id' }, { status: 400 });
    }

    const body = (await request.json()) as EditPayload;
    const { guest_id, given_name, family_name, title, is_adult, food_eater } = body;

    if (!guest_id || !UUID_V4_PATTERN.test(guest_id)) {
      return NextResponse.json({ error: 'Invalid guest_id' }, { status: 400 });
    }

    const normalizedGivenName = (given_name ?? '').trim();
    const normalizedFamilyName = (family_name ?? '').trim();

    if (!normalizedGivenName || !normalizedFamilyName) {
      return NextResponse.json(
        { error: 'given_name and family_name are required' },
        { status: 400 }
      );
    }

    if (typeof is_adult !== 'boolean') {
      return NextResponse.json({ error: 'is_adult must be a boolean' }, { status: 400 });
    }

    await conn.beginTransaction();

    const [inviteRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM invitations WHERE id = ?`,
      [inviteId]
    );
    if (inviteRows.length === 0) {
      await conn.rollback();
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const [guestRows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM guests WHERE id = ? AND invitation_id = ?`,
      [guest_id, inviteId]
    );
    if (guestRows.length === 0) {
      await conn.rollback();
      return NextResponse.json(
        { error: 'Guest not found for this invitation' },
        { status: 404 }
      );
    }

    await conn.query<ResultSetHeader>(
      `UPDATE guests
       SET
         given_name = ?,
         family_name = ?,
         title = ?,
         is_adult = ?,
         food_eater = ?,
         updated_at = NOW()
       WHERE id = ?
         AND invitation_id = ?`,
      [
        normalizedGivenName,
        normalizedFamilyName,
        title?.trim() || null,
        is_adult,
        food_eater?.trim() || null,
        guest_id,
        inviteId,
      ]
    );

    const [updatedRows] = await conn.query<RowDataPacket[]>(
      `SELECT
         id,
         invitation_id,
         given_name,
         family_name,
         title,
         is_adult,
         food_eater,
         updated_at
       FROM guests
       WHERE id = ?
         AND invitation_id = ?`,
      [guest_id, inviteId]
    );

    await conn.commit();

    return NextResponse.json(
      { success: true, guest: updatedRows[0] ?? null },
      { status: 200 }
    );
  } catch (error) {
    try {
      await conn.rollback();
    } catch {
      // ignore rollback errors
    }
    console.error('Error editing invitation guest:', error);
    return NextResponse.json(
      { error: 'Failed to edit invitation guest' },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
