import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import pool from "@/app/lib/db";
import {
  consumeUploadAllowance,
  detectUploadedImageFormat,
  MAX_PHOTO_BYTES,
  PhotoUploadError,
  readUploadBody,
  removeStoredPhoto,
  storeUploadedPhoto,
} from "@/app/lib/photo-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApprovedPhotoRow = RowDataPacket & {
  id: string;
  width: number;
  height: number;
  created_at: Date;
};

export async function GET() {
  try {
    const [rows] = await pool.query<ApprovedPhotoRow[]>(
      `SELECT id, width, height, created_at
       FROM photo_uploads
       WHERE status = 'approved'
       ORDER BY created_at DESC`,
    );

    return NextResponse.json(
      rows.map((photo) => ({
        id: photo.id,
        width: photo.width,
        height: photo.height,
        createdAt: photo.created_at,
        url: `/api/photos/${photo.id}`,
      })),
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load approved photos:", error);
    return NextResponse.json(
      { error: "Approved photos are temporarily unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let filepath: string | null = null;
  try {
    await consumeUploadAllowance(request);

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
      throw new PhotoUploadError("Submit a photo using the upload form.", 400);
    }

    const body = await readUploadBody(request);
    let formData: FormData;
    try {
      formData = await new Response(body, {
        headers: { "Content-Type": contentType },
      }).formData();
    } catch {
      throw new PhotoUploadError("The upload form could not be read.", 400);
    }

    const files = formData.getAll("photo");
    const file = files[0];
    if (files.length !== 1 || !file || typeof file === "string") {
      throw new PhotoUploadError("Choose one photo to upload.", 400);
    }
    if (file.size === 0) {
      throw new PhotoUploadError("The selected file is empty.", 400);
    }
    if (file.size > MAX_PHOTO_BYTES) {
      throw new PhotoUploadError("The photo must be no larger than 20 MB.", 413);
    }

    const input = Buffer.from(await file.arrayBuffer());
    const format = detectUploadedImageFormat(input);
    if (!format) {
      throw new PhotoUploadError(
        "Use a JPEG, PNG, WebP, or HEIC image.",
        415,
      );
    }

    const id = randomUUID();
    const stored = await storeUploadedPhoto(input, id);
    filepath = stored.filepath;

    try {
      await pool.execute(
        `INSERT INTO photo_uploads
          (id, stored_filename, mime_type, width, height, size_bytes, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [
          id,
          stored.filename,
          stored.mimeType,
          stored.width,
          stored.height,
          stored.sizeBytes,
        ],
      );
    } catch (error) {
      await removeStoredPhoto(stored.filepath);
      filepath = null;
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Your photo was submitted for approval." },
      { status: 201 },
    );
  } catch (error) {
    if (filepath) {
      try {
        await removeStoredPhoto(filepath);
      } catch (cleanupError) {
        console.error("Failed to remove an unregistered photo upload:", cleanupError);
      }
    }
    if (error instanceof PhotoUploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to process photo upload:", error);
    return NextResponse.json(
      { error: "The photo could not be uploaded. Please try again later." },
      { status: 500 },
    );
  }
}
