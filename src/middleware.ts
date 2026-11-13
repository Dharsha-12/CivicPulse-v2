import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "civicpulse-v2-super-secure-production-jwt-token-secret-key-2026";
const encodedKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "civicpulse_session";

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: "CITIZEN" | "WORKER" | "ADMIN";
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  // 1. If visiting /login while already authenticated, redirect to their role dashboard
  if (pathname === "/login" && user) {
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (user.role === "WORKER") {
      return NextResponse.redirect(new URL("/worker", request.url));
    } else {
      return NextResponse.redirect(new URL("/citizen", request.url));
    }
  }

  // 2. Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      // Redirect unauthorized worker or citizen to their respective dashboard
      const target = user.role === "WORKER" ? "/worker" : "/citizen";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // 3. Protect /worker routes
  if (pathname.startsWith("/worker")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "WORKER" && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/citizen", request.url));
    }
  }

  // 4. Protect /citizen routes
  if (pathname.startsWith("/citizen")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/citizen/:path*",
    "/worker/:path*",
    "/admin/:path*",
  ],
};
