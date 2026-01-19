import * as db from "@/app/lib/db";

type LogParams = {
  guestId: string;
  newValue?: string | null;
};

/**
 * Insert a row into rsvp_change_log using the project's DB helper.
 * This helper adapts to common exports from /app/lib/db (query/execute on the
 * default export or named export).
 */
export async function logRsvpChange(params: LogParams) {
  const sql =
    `INSERT INTO rsvp_change_log (guest_id, new_value)
     VALUES (?, ?)`;
  const values = [
    params.guestId,
    params.newValue ?? null,
  ];

  // runtime-adapt to whatever the project's db helper exports
  const maybeDb: Record<string, unknown> = db as Record<string, unknown>;
  try {
    if (maybeDb.query && typeof maybeDb.query === "function") {
      await maybeDb.query(sql, values);
      return;
    }

    if (maybeDb.execute && typeof maybeDb.execute === "function") {
      await maybeDb.execute(sql, values);
      return;
    }

    // handle default export shapes
    const def = maybeDb.default ?? maybeDb;
    const defAsRecord = def as Record<string, unknown>;
    if (defAsRecord && typeof defAsRecord.query === "function") {
      await (defAsRecord.query as (sql: string, values: unknown[]) => Promise<void>)(sql, values);
      return;
    }
    if (defAsRecord && typeof defAsRecord.execute === "function") {
      await (defAsRecord.execute as (sql: string, values: unknown[]) => Promise<void>)(sql, values);
      return;
    }

    console.warn("No usable DB client found in /app/lib/db; RSVP log skipped");
  } catch (err) {
    console.error("Failed to write RSVP change log:", err);
    throw err;
  }
}