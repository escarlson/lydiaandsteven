import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import pool from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { getPhotoUploadDirectory } from "@/app/lib/photo-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PhotoRow = RowDataPacket & {
  id: string;
  stored_filename: string;
  mime_type: string;
  size_bytes: number;
  status: "pending" | "approved" | "rejected";
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

const isPhotoId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

async function getPhoto(id: string) {
  const [rows] = await pool.execute<PhotoRow[]>(
    `SELECT id, stored_filename, mime_type, size_bytes, status
     FROM photo_uploads
     WHERE id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!isPhotoId(id)) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const reviewMode = new URL(request.url).searchParams.get("review") === "1";
  if (reviewMode && !(await auth.api.getSession({ headers: request.headers }))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const photo = await getPhoto(id);
    if (!photo || (photo.status !== "approved" && !reviewMode)) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    if (photo.stored_filename !== `${id}.jpg` || photo.mime_type !== "image/jpeg") {
      console.error("Photo record has an invalid stored filename or media type:", id);
      return NextResponse.json(
        { error: "The photo is temporarily unavailable." },
        { status: 500 },
      );
    }

    const directory = await getPhotoUploadDirectory();
    const imagePath = path.join(directory, photo.stored_filename);
    const image = await readFile(imagePath);

    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": photo.mime_type,
        "Content-Length": String(image.byteLength),
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control":
          photo.status === "approved"
            ? "public, max-age=60, stale-while-revalidate=300"
            : "private, no-store",
      },
    });
  } catch (error) {
    console.error("Failed to serve photo:", error);
    return NextResponse.json(
      { error: "The photo is temporarily unavailable." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!isPhotoId(id)) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const status =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as { status?: unknown }).status
      : undefined;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { error: "Choose approved or rejected as the review status." },
      { status: 400 },
    );
  }

  try {
    const [result] = await pool.execute(
      `UPDATE photo_uploads
       SET status = ?, reviewed_at = UTC_TIMESTAMP(), reviewed_by = ?
       WHERE id = ? AND status = 'pending'`,
      [status, session.user.email, id],
    );

    if (!("affectedRows" in result) || result.affectedRows !== 1) {
      return NextResponse.json(
        { error: "This photo is no longer awaiting review." },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Failed to review photo:", error);
    return NextResponse.json(
      { error: "The photo could not be reviewed. Please try again." },
      { status: 500 },
    );
  }
}
