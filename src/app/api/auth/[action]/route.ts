import { NextResponse } from "next/server";
import { dbEnabled } from "@/lib/server/db";
import { clearSession, createSession, currentUser, loginUser, registerUser, updateUserName } from "@/lib/server/auth";

export const runtime = "nodejs";

/**
 * /api/auth/me       GET  → { configured, user }
 * /api/auth/login    POST { email, password }
 * /api/auth/register POST { name, email, password }
 * /api/auth/logout   POST
 * /api/auth/name     POST { name }
 */
export async function GET(_req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (action !== "me") return NextResponse.json({ error: "not found" }, { status: 404 });
  const configured = dbEnabled && Boolean(process.env.AUTH_SECRET);
  const user = configured ? await currentUser() : null;
  return NextResponse.json({ configured, user });
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!dbEnabled || !process.env.AUTH_SECRET) return NextResponse.json({ error: "المصادقة غير مضبوطة على الخادم" }, { status: 503 });
  try {
    if (action === "logout") {
      await clearSession();
      return NextResponse.json({ ok: true });
    }
    const body = (await req.json().catch(() => ({}))) as Record<string, string>;
    if (action === "login") {
      if (!body.email || !body.password) return NextResponse.json({ error: "أدخل البريد وكلمة المرور." }, { status: 400 });
      const user = await loginUser(body.email, body.password);
      await createSession(user);
      return NextResponse.json({ user });
    }
    if (action === "register") {
      if (!body.name?.trim() || !body.email || (body.password ?? "").length < 6)
        return NextResponse.json({ error: "أكمل البيانات (كلمة المرور 6 أحرف على الأقل)." }, { status: 400 });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح." }, { status: 400 });
      const user = await registerUser(body.name, body.email, body.password);
      await createSession(user);
      return NextResponse.json({ user });
    }
    if (action === "name") {
      const me = await currentUser();
      if (!me) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });
      const name = (body.name ?? "").trim() || me.name;
      await updateUserName(me.uid, name);
      const user = { ...me, name };
      await createSession(user);
      return NextResponse.json({ user });
    }
    return NextResponse.json({ error: "not found" }, { status: 404 });
  } catch (e) {
    const msg = (e as Error).message;
    const known = msg.includes("مسبقاً") || msg.includes("غير صحيحة");
    if (!known) console.error("auth error", e);
    return NextResponse.json({ error: known ? msg : "حدث خطأ في الخادم، حاول لاحقاً." }, { status: known ? 400 : 500 });
  }
}
