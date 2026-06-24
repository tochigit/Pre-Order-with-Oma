import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  const ua = request.headers.get("user-agent") ?? "";
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && ua.trim().length < 10) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.gif).*)"],
};