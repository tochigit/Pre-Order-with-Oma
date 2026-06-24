import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const COOKIE_NAME = "oma_admin_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  return secret;
}

function sign(payload: string): string {
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function verifyToken(token: string): boolean {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;

    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("base64url");

    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return false;
    }

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!decoded.exp || decoded.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function createSessionToken(): string {
  const payload = JSON.stringify({
    exp: Date.now() + SESSION_DURATION,
    iat: Date.now(),
  });
  return sign(Buffer.from(payload).toString("base64url"));
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function verifyPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const inputBytes = Buffer.from(input);
  const adminBytes = Buffer.from(adminPassword);

  if (inputBytes.length !== adminBytes.length) return false;
  return crypto.timingSafeEqual(inputBytes, adminBytes);
}

// ── Rate Limiting (login) ──
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.lastAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  entry.lastAttempt = now;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ── Audit Logging ──
export async function writeAuditLog(entry: {
  action: string;
  targetType?: string;
  targetId?: string | null;
  ip?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        action: entry.action,
        targetType: entry.targetType ?? "",
        targetId: entry.targetId ?? null,
        ip: entry.ip ?? "",
        userAgent: (entry.userAgent ?? "").slice(0, 500),
        meta: (entry.meta ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("[audit] failed to write log:", err);
  }
}

export function auditContext(request: NextRequest) {
  return {
    ip: getClientIP(request),
    userAgent: request.headers.get("user-agent") ?? "",
  };
}

// ── Rate Limiting (mutations) ──
const mutationAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_MUTATIONS_PER_MIN = 30;
const MUTATION_WINDOW_MS = 60 * 1000;

export function checkMutationRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = mutationAttempts.get(ip);

  if (!entry || now - entry.lastAttempt > MUTATION_WINDOW_MS) {
    mutationAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: MAX_MUTATIONS_PER_MIN - 1 };
  }

  if (entry.count >= MAX_MUTATIONS_PER_MIN) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  entry.lastAttempt = now;
  return { allowed: true, remaining: MAX_MUTATIONS_PER_MIN - entry.count };
}