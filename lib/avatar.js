import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";

const MAX_INPUT_BYTES = 512 * 1024;
const MAX_DIMENSION = 2048;
const MAX_OUTPUT_BYTES = 64 * 1024;
const OUTPUT_SIZE = 128;
const AVATAR_BUCKET = "supporter-avatars";

const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/i;

/** Decode a canvas data URL from the browser (JPEG/PNG/WebP only). */
export function parseAvatarDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const trimmed = dataUrl.trim();
  if (trimmed.length > 280000) throw new Error("avatar_too_large");
  const match = DATA_URL_RE.exec(trimmed);
  if (!match) throw new Error("avatar_invalid");
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > MAX_INPUT_BYTES) {
    throw new Error("avatar_too_large");
  }
  return buffer;
}

/** Re-encode to a small WebP square — mitigates decompression / pixel bombs. */
export async function normalizeAvatarBuffer(inputBuffer) {
  if (!inputBuffer?.length) throw new Error("avatar_invalid");
  if (inputBuffer.length > MAX_INPUT_BYTES) throw new Error("avatar_too_large");

  const image = sharp(inputBuffer, {
    failOn: "error",
    limitInputPixels: MAX_DIMENSION * MAX_DIMENSION,
    sequentialRead: true,
  });

  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new Error("avatar_invalid");
  if (meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION) {
    throw new Error("avatar_dimensions");
  }

  const buffer = await image
    .rotate()
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  if (buffer.length > MAX_OUTPUT_BYTES) throw new Error("avatar_processed_too_large");
  return { buffer, contentType: "image/webp", ext: "webp" };
}

function emailHash(email) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 20);
}

/** Upload normalized avatar and return public URL. */
export async function uploadSupporterAvatar(sb, email, inputBuffer) {
  const normalized = await normalizeAvatarBuffer(inputBuffer);
  const path = `${emailHash(email)}/${randomUUID()}.${normalized.ext}`;
  const { error } = await sb.storage.from(AVATAR_BUCKET).upload(path, normalized.buffer, {
    contentType: normalized.contentType,
    upsert: true,
    cacheControl: "3600",
  });
  if (error) throw new Error(`avatar_upload_failed:${error.message}`);
  const { data } = sb.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function avatarErrorResponse(error) {
  const msg = error?.message || "";
  if (
    msg === "avatar_too_large" ||
    msg === "avatar_invalid" ||
    msg === "avatar_dimensions" ||
    msg === "avatar_processed_too_large" ||
    msg.startsWith("avatar_upload_failed:")
  ) {
    return { status: 400, error: msg.split(":")[0] };
  }
  return null;
}
