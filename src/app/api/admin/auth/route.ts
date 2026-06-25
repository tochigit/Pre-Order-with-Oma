import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  checkRateLimit,
  getClientIP,
  verifyPassword,
  isAuthenticated,
  writeAuditLog,
  auditContext,
} from "@/lib/auth";
import { validate, loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const ctx = auditContext(request);

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      await writeAuditLog({
        action: "auth.login.blocked",
        targetType: "session",
        ...ctx,
        meta: { reason: "rate_limited" },
      });
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const result = validate(loginSchema, raw);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (!verifyPassword(result.data.password)) {
      await writeAuditLog({
        action: "auth.login.failed",
        targetType: "session",
        ...ctx,
        meta: { remaining: rateLimit.remaining },
      });
      return NextResponse.json(
        { error: `Invalid password. ${rateLimit.remaining} attempts remaining.` },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true });
    setSessionCookie(response, token);

    await writeAuditLog({
      action: "auth.login.success",
      targetType: "session",
      ...ctx,
      meta: {},
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAuthenticated(request) });
}

export async function DELETE(request: NextRequest) {
  const ctx = auditContext(request);
  await writeAuditLog({
    action: "auth.logout",
    targetType: "session",
    ...ctx,
    meta: {},
  });
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}