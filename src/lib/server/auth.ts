import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { ensureSchema, sql } from "./db";
import type { UserProfile } from "@/lib/types";

const COOKIE = "shamal_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 يوماً

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET غير مضبوط");
  return new TextEncoder().encode(s);
}

export async function createSession(user: UserProfile) {
  const token = await new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.uid)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

/** المستخدم الحالي من الكوكي (بدون استعلام قاعدة البيانات) */
export async function currentUser(): Promise<UserProfile | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      uid: payload.sub!,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      createdAt: (payload.iat ?? 0) * 1000,
    };
  } catch {
    return null;
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function registerUser(name: string, email: string, password: string): Promise<UserProfile> {
  await ensureSchema();
  const q = sql();
  const e = email.trim().toLowerCase();
  const existing = await q`SELECT id FROM users WHERE email = ${e}`;
  if (existing.length) throw new Error("البريد مستخدم مسبقاً.");
  const hash = await bcrypt.hash(password, 10);
  const user: UserProfile = { uid: uid(), name: name.trim(), email: e, createdAt: Date.now() };
  await q`INSERT INTO users (id, name, email, password_hash, created_at) VALUES (${user.uid}, ${user.name}, ${user.email}, ${hash}, ${user.createdAt})`;
  return user;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  await ensureSchema();
  const q = sql();
  const e = email.trim().toLowerCase();
  const rows = await q`SELECT id, name, email, password_hash, created_at FROM users WHERE email = ${e}`;
  const row = rows[0] as { id: string; name: string; email: string; password_hash: string; created_at: number } | undefined;
  if (!row || !(await bcrypt.compare(password, row.password_hash))) throw new Error("بيانات الدخول غير صحيحة.");
  return { uid: row.id, name: row.name, email: row.email, createdAt: Number(row.created_at) };
}

export async function updateUserName(id: string, name: string) {
  await ensureSchema();
  await sql()`UPDATE users SET name = ${name} WHERE id = ${id}`;
}
