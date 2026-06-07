import pool from './db'
import { logRsvpChange } from './logger';

// InviteGuestRow includes data from both invites and guests tables
type InviteGuestRow = {
  invite_id: number;
  household_name: string;
  invite_postal_code: string;
  sent_at: Date | null;
  rsvp_deadline: Date | null;
  guest_id: number;
  title: string | null;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult: number | boolean;
  guest_created_at: Date;
  guest_updated_at: Date;
};

// SERVER-SIDE ONLY: Direct database access
const fetchInviteById = async (id: string) => {
  try {
    // find invites joined to any matching guests
    const [result] = await pool.query(
      `SELECT
         i.invite_id,
         i.household_name,
         i.postal_code AS invite_postal_code,
         i.sent_at,
         i.rsvp_deadline,
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
       WHERE i.invite_id = ?`,
      [id]
    );

    const rows = result as InviteGuestRow[];

    // if no results found
    if (rows.length === 0) {
      return null;
    }

    // group rows by invite_id so each invite has a `guests` array
    const invitesMap = new Map();
    for (const r of rows) {
      const inviteId = r.invite_id;
      if (!invitesMap.has(inviteId)) {
        invitesMap.set(inviteId, {
          invite_id: r.invite_id,
          household_name: r.household_name,
          postal_code: r.invite_postal_code,
          sent_at: r.sent_at,
          guests: [],
          rsvp_deadline: r.rsvp_deadline,
        });
      }

      invitesMap.get(inviteId).guests.push({
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
    return results[0];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

const updateGuestRSVP = async (guestId: string | number, rsvpStatus: 'accepted' | 'declined') => {
  try {
    const [result] = await pool.query(
      `UPDATE guests SET rsvp_status = ?, updated_at = NOW() WHERE guest_id = ?`,
      [rsvpStatus, guestId]
    );

    const res = result as { affectedRows: number };

    logRsvpChange({
      guestId: guestId.toString(),
      newValue: rsvpStatus,
    });

    return res.affectedRows && res.affectedRows > 0;
  } catch (error) {
    console.error("Database update error:", error);
    throw error;
  }
};

const updateGuestName = async (guestId: string | number, givenName: string, familyName: string, title?: string | null) => {
  try {
    const [result] = await pool.query(
      `UPDATE guests SET given_name = ?, family_name = ?, title = ?, updated_at = NOW() WHERE guest_id = ?`,
      [givenName, familyName, title ?? null, guestId]
    );

    const res = result as { affectedRows: number };
    return res.affectedRows && res.affectedRows > 0;
  } catch (error) {
    console.error("Database update error:", error);
    throw error;
  }
};

const fetchAllInvitationsWithGuests = async () => {
  try {
    const [result] = await pool.query(
      `SELECT
         i.invite_id,
         i.household_name,
         i.postal_code,
         g.guest_id,
         g.invite_id AS guest_invite_id,
         g.title,
         g.given_name,
         g.family_name,
         g.rsvp_status,
         g.is_adult,
         g.meal,
         g.rehearsal_guest,
         g.rehearsal_meal,
         g.updated_at
       FROM invites i
       LEFT JOIN guests g ON i.invite_id = g.invite_id
       ORDER BY g.updated_at, g.guest_id`
    );

    const rows = result as Array<{
      invite_id: number;
      household_name: string;
      postal_code: string | null;
      guest_id: number | null;
      guest_invite_id: number | null;
      given_name: string | null;
      family_name: string | null;
      title: string | null;
      rsvp_status: string | null;
      is_adult: number | boolean | null;
      meal: number | boolean | null;
      rehearsal_guest: number | boolean | null;
      rehearsal_meal: number | boolean | null;
      updated_at: Date | null;
    }>;

    type InvitationRecord = {
      invite_id: number;
      household_name: string;
      postal_code: string | null;
      guests: Array<{
        guest_id: number;
        invite_id: number | null;
        title: string | null;
        given_name: string | null;
        family_name: string | null;
        rsvp_status: string | null;
        is_adult: boolean;
        meal: boolean;
        rehearsal_guest: boolean;
        rehearsal_meal: boolean;
        updated_at: Date | null;
      }>;
      alerts: string[];
    };

    const normalizeSearchValue = (value: string | null | undefined) =>
      (value ?? '').trim().toLowerCase();

    const findDuplicateGuestInviteIds = (invitations: InvitationRecord[]) => {
      const inviteIdsByGuestKey = new Map<string, Set<number>>();

      for (const invitation of invitations) {
        const normalizedPostalCode = normalizeSearchValue(invitation.postal_code);

        for (const guest of invitation.guests) {
          const guestKey = [
            normalizeSearchValue(guest.given_name),
            normalizeSearchValue(guest.family_name),
            normalizedPostalCode,
          ].join('|');

          const inviteIds = inviteIdsByGuestKey.get(guestKey) ?? new Set<number>();
          inviteIds.add(invitation.invite_id);
          inviteIdsByGuestKey.set(guestKey, inviteIds);
        }
      }

      const duplicateInviteIds = new Set<number>();
      for (const inviteIds of inviteIdsByGuestKey.values()) {
        if (inviteIds.size > 1) {
          for (const inviteId of inviteIds) {
            duplicateInviteIds.add(inviteId);
          }
        }
      }

      return duplicateInviteIds;
    };

    const buildInvitationAlerts = (
      invitation: InvitationRecord,
      duplicateInviteIds: Set<number>
    ) => {
      const alerts: string[] = [];

      if (!invitation.postal_code || invitation.postal_code.trim() === '') {
        alerts.push('Missing postal code');
      }

      if (invitation.guests.length === 0) {
        alerts.push('No guests on invitation');
      }

      if (duplicateInviteIds.has(invitation.invite_id)) {
        alerts.push('Possible duplicate guest across invitations');
      }

      return alerts;
    };

    // Group by invitation
    const invitationsMap = new Map<number, InvitationRecord>();
    for (const row of rows) {
      const inviteId = row.invite_id;
      
      if (!invitationsMap.has(inviteId)) {
        invitationsMap.set(inviteId, {
          invite_id: row.invite_id,
          household_name: row.household_name,
          postal_code: row.postal_code,
          guests: [],
          alerts: [],
        });
      }

      const invitation = invitationsMap.get(inviteId);
      if (!invitation) {
        continue;
      }

      // Only add guest if guest_id exists (LEFT JOIN may return null guests)
      if (row.guest_id) {
        invitation.guests.push({
          guest_id: row.guest_id,
          invite_id: row.guest_invite_id,
          title: row.title,
          given_name: row.given_name,
          family_name: row.family_name,
          rsvp_status: row.rsvp_status,
          is_adult: !!row.is_adult,
          meal: !!row.meal,
          rehearsal_guest: !!row.rehearsal_guest,
          rehearsal_meal: !!row.rehearsal_meal,
          updated_at: row.updated_at,
        });
      }
    }

    const invitationRecords = Array.from(invitationsMap.values());
    const duplicateInviteIds = findDuplicateGuestInviteIds(invitationRecords);

    const invitations = invitationRecords.map((invitation) => ({
      ...invitation,
      alerts: buildInvitationAlerts(invitation, duplicateInviteIds),
    }));

    return invitations;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

const fetchRsvpSummary = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT rsvp_status, COUNT(*) AS count FROM guests GROUP BY rsvp_status`
    );

    let accepted = 0;
    let declined = 0;
    let pending = 0;

    for (const row of rows as Array<{ rsvp_status: string | null; count: number }>) {
      const count = Number(row.count);
      if (row.rsvp_status === 'accepted') {
        accepted = count;
      } else if (row.rsvp_status === 'declined') {
        declined = count;
      } else {
        pending += count;
      }
    }

    const total = accepted + declined + pending;
    return { accepted, declined, pending, total };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const fetchFoodEaterSummary = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT rsvp_status, COUNT(*) AS count FROM guests WHERE meal = 1 GROUP BY rsvp_status`
    );

    let accepted = 0;
    let pending = 0;
    const theCouple = 2; // hardcoded since we know both Steven and Lydia are food eaters

    for (const row of rows as Array<{ rsvp_status: string | null; count: number }>) {
      const count = Number(row.count);
      if (row.rsvp_status === 'accepted') {
        accepted = count;
      } else if (row.rsvp_status !== 'declined') {
        pending += count;
      }
    }

    return { accepted, pending, theCouple };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export { fetchInviteById, updateGuestRSVP, updateGuestName, fetchAllInvitationsWithGuests, fetchRsvpSummary, fetchFoodEaterSummary };