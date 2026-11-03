import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { mkdir, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pool from "@/app/lib/db";

export const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_PHOTO_BYTES + 128 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const RATE_LIMIT = 10;

export class PhotoUploadError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PhotoUploadError";
  }
}

function isWithinDirectory(candidate: string, directory: string) {
  const relative = path.relative(directory, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

export async function getPhotoUploadDirectory() {
  const configuredDirectory = process.env.PHOTO_UPLOAD_DIR;
  if (process.env.NODE_ENV === "production" && !configuredDirectory) {
    throw new Error("PHOTO_UPLOAD_DIR must be configured in production");
  }
  if (configuredDirectory && !path.isAbsolute(configuredDirectory)) {
    throw new Error("PHOTO_UPLOAD_DIR must be an absolute path");
  }

  const requestedDirectory =
    configuredDirectory ?? path.join(process.cwd(), ".local-photo-uploads");
  await mkdir(requestedDirectory, { recursive: true, mode: 0o700 });
  const directory = await realpath(/*turbopackIgnore: true*/ requestedDirectory);

  if (
    process.env.NODE_ENV === "production" &&
    isWithinDirectory(directory, await realpath(process.cwd()))
  ) {
    throw new Error("PHOTO_UPLOAD_DIR must be outside the application directory");
  }

  return directory;
}

function detectImageFormat(buffer: Buffer): "jpeg" | "png" | "webp" | "heic" | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (buffer.length >= 16 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const heicBrands = new Set([
      "heic",
      "heix",
      "hevc",
      "hevx",
      "heim",
      "heis",
      "hevm",
      "hevs",
    ]);
    const brandEnd = Math.min(buffer.length, 128);
    for (let offset = 8; offset + 4 <= brandEnd; offset += 4) {
      if (heicBrands.has(buffer.toString("ascii", offset, offset + 4))) {
        return "heic";
      }
    }
  }
  return null;
}

async function normalizePhoto(
  input: Buffer,
  id: string,
) {
  try {
    const image = sharp(input, {
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
      pages: 1,
    }).rotate();
    const { data: output, info } = await image
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    if (info.width * info.height > MAX_IMAGE_PIXELS) {
      throw new PhotoUploadError("The image dimensions are too large.", 413);
    }
    if (output.byteLength > MAX_PHOTO_BYTES) {
      throw new PhotoUploadError(
        "The processed image is larger than the 20 MB limit.",
        413,
      );
    }

    return {
      buffer: output,
      width: info.width,
      height: info.height,
      filename: `${id}.jpg`,
    };
  } catch (error) {
    if (error instanceof PhotoUploadError) throw error;
    throw new PhotoUploadError(
      "The image is invalid or could not be decoded.",
      400,
    );
  }
}

export async function readUploadBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    throw new PhotoUploadError("The upload must be no larger than 20 MB.", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) {
    throw new PhotoUploadError("Choose a photo to upload.", 400);
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new PhotoUploadError("The upload must be no larger than 20 MB.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks, totalBytes);
}

export async function consumeUploadAllowance(request: Request) {
  let clientAddress = request.headers.get("x-real-ip")?.trim();
  if (!clientAddress && process.env.NODE_ENV !== "production") {
    clientAddress = "127.0.0.1";
  }
  if (!clientAddress || isIP(clientAddress) === 0) {
    throw new PhotoUploadError(
      "Photo uploads are temporarily unavailable. Please try again later.",
      503,
    );
  }

  const secret =
    process.env.PHOTO_RATE_LIMIT_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("PHOTO_RATE_LIMIT_SECRET or BETTER_AUTH_SECRET must be configured");
  }
  const ipHash = createHmac("sha256", secret).update(clientAddress).digest("hex");
  const lockName = `photo-rate:${ipHash.slice(0, 40)}`;
  const connection = await pool.getConnection();
  let lockAcquired = false;

  try {
    const [lockRows] = await connection.query(
      "SELECT GET_LOCK(?, 5) AS acquired",
      [lockName],
    ) as [{ acquired: number | null }[], unknown];
    if (lockRows[0]?.acquired !== 1) {
      throw new PhotoUploadError(
        "Photo uploads are busy. Please try again shortly.",
        503,
      );
    }
    lockAcquired = true;

    const [countRows] = await connection.query(
      `SELECT COUNT(*) AS attempts
       FROM photo_upload_attempts
       WHERE ip_hash = ? AND attempted_at >= UTC_TIMESTAMP() - INTERVAL 1 HOUR`,
      [ipHash],
    ) as [{ attempts: number }[], unknown];

    if (Number(countRows[0]?.attempts ?? 0) >= RATE_LIMIT) {
      throw new PhotoUploadError(
        "You have reached the limit of 10 photo uploads per hour. Please try again later.",
        429,
      );
    }

    await connection.execute(
      "INSERT INTO photo_upload_attempts (ip_hash, attempted_at) VALUES (?, UTC_TIMESTAMP())",
      [ipHash],
    );

    if (Math.random() < 0.02) {
      await connection.execute(
        "DELETE FROM photo_upload_attempts WHERE attempted_at < UTC_TIMESTAMP() - INTERVAL 1 DAY",
      );
    }
  } finally {
    try {
      if (lockAcquired) {
        await connection.query("SELECT RELEASE_LOCK(?)", [lockName]);
      }
    } finally {
      connection.release();
    }
  }
}

export async function storeUploadedPhoto(
  input: Buffer,
  id: string,
) {
  const processed = await normalizePhoto(input, id);
  const directory = await getPhotoUploadDirectory();
  const filepath = path.join(directory, processed.filename);

  try {
    await writeFile(filepath, processed.buffer, { flag: "wx", mode: 0o600 });
  } catch (error) {
    try {
      await rm(filepath, { force: true });
    } catch (cleanupError) {
      console.error("Failed to remove a partial photo upload:", cleanupError);
    }
    throw error;
  }

  return {
    ...processed,
    filepath,
    mimeType: "image/jpeg",
    sizeBytes: processed.buffer.byteLength,
  };
}

export async function removeStoredPhoto(filepath: string) {
  await rm(filepath, { force: true });
}

export function detectUploadedImageFormat(buffer: Buffer) {
  return detectImageFormat(buffer);
}
