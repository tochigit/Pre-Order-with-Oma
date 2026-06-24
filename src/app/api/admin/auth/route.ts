import { NextRequest, NextResponse } from "next/server";
import {
  isAuthenticated,
  checkMutationRateLimit,
  getClientIP,
  writeAuditLog,
  auditContext,
} from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
};

function matchesMagic(fileBytes: Uint8Array, mime: string): boolean {
  const expected = MAGIC_BYTES[mime];
  if (!expected) return false;
  if (fileBytes.length < expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (fileBytes[i] !== expected[i]) return false;
  }
  if (mime === "image/webp") {
    if (fileBytes.length < 12) return false;
    const tag = String.fromCharCode(
      fileBytes[8],
      fileBytes[9],
      fileBytes[10],
      fileBytes[11]
    );
    return tag === "WEBP";
  }
  return true;
}

function safeExtFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg": return ".jpg";
    case "image/png":  return ".png";
    case "image/webp": return ".webp";
    case "image/gif":  return ".gif";
    default:           return "";
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIP(request);
  const rl = checkMutationRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Slow down." },
      { status: 429 }
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
      { status: 413 }
    );
  }

  const claimedType = (file.type || "").toLowerCase();
  if (!ALLOWED_MIME.has(claimedType)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." },
      { status: 415 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  if (!matchesMagic(bytes, claimedType)) {
    return NextResponse.json(
      { error: "File content does not match its declared type." },
      { status: 415 }
    );
  }

  const ext = safeExtFromMime(claimedType);
  const randomName = `${crypto.randomUUID()}${ext}`;
  const objectPath = `products/${randomName}`;

  let publicUrl: string;
  try {
    const supabase = createServerClient();
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(objectPath, arrayBuffer, {
        contentType: claimedType,
        cacheControl: "3600",
        upsert: false,
      });

    if (upErr) {
      console.error("[upload] supabase upload error:", upErr);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    const { data: pub } = supabase.storage
      .from("product-images")
      .getPublicUrl(objectPath);
    publicUrl = pub.publicUrl;
  } catch (err) {
    console.error("[upload] unexpected:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }

  await writeAuditLog({
    action: "upload.image",
    targetType: "image",
    targetId: objectPath,
    ...auditContext(request),
    meta: {
      size: file.size,
      mime: claimedType,
      bucket: "product-images",
    },
  });

  return NextResponse.json({ url: publicUrl, path: objectPath });
}