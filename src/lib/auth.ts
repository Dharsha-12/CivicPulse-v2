import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CITIZEN" | "WORKER" | "ADMIN";
  city: string;
  department?: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET || "civicpulse-v2-super-secure-production-jwt-token-secret-key-2026";
const encodedKey = new TextEncoder().encode(JWT_SECRET);
export const COOKIE_NAME = "civicpulse_session";

export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    city: user.city,
    department: user.department ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "CITIZEN" | "WORKER" | "ADMIN",
      city: payload.city as string,
      department: (payload.department as string) || null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
