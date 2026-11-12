import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import pool from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

type ModerationPhotoRow = RowDataPacket & {
  id: string;
  width: number;
  height: number;
  size_bytes: number;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
};

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [rows] = await pool.query<ModerationPhotoRow[]>(
      `SELECT id, width, height, size_bytes, status, created_at, reviewed_at, reviewed_by
       FROM photo_uploads
       WHERE status IN ('pending', 'approved', 'rejected')
       ORDER BY status = 'pending' DESC, status = 'approved' DESC, created_at DESC`,
    );

    return NextResponse.json(
      {
        photos: rows.map((photo) => ({
          ...photo,
          url: `/api/photos/${photo.id}?review=1`,
        })),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Failed to load photos for moderation:", error);
    return NextResponse.json(
      { error: "The moderation queue is temporarily unavailable." },
      { status: 500 },
    );
  }
}
