import { NextResponse } from "next/server";
import { currentUser } from "@/lib/server/auth";
import { ensureSchema, sql } from "@/lib/server/db";

export const runtime = "nodejs";

const COLLECTIONS = { journeys: "updatedAt", notifications: "at" } as const;
type Collection = keyof typeof COLLECTIONS;

/**
 * /api/data/journeys | /api/data/notifications
 * GET    → قائمة عناصر المستخدم الحالي
 * PUT    { item } → إدراج/تحديث
 * DELETE { id }   → حذف
 */
async function guard(collection: string) {
  if (!(collection in COLLECTIONS)) return { error: NextResponse.json({ error: "not found" }, { status: 404 }) };
  const user = await currentUser();
  if (!user) return { error: NextResponse.json({ error: "غير مسجل" }, { status: 401 }) };
  await ensureSchema();
  return { user, col: collection as Collection };
}

export async function GET(_req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const g = await guard(collection);
  if ("error" in g) return g.error;
  const q = sql();
  const rows =
    g.col === "journeys"
      ? await q`SELECT data FROM journeys WHERE user_id = ${g.user.uid} ORDER BY updated_at DESC`
      : await q`SELECT data FROM notifications WHERE user_id = ${g.user.uid} ORDER BY at DESC LIMIT 100`;
  return NextResponse.json({ items: rows.map((r) => r.data) });
}

export async function PUT(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const g = await guard(collection);
  if ("error" in g) return g.error;
  const { item } = (await req.json()) as { item: Record<string, unknown> & { id: string } };
  if (!item?.id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  const data: Record<string, unknown> & { id: string } = { ...item, userId: g.user.uid };
  const q = sql();
  if (g.col === "journeys") {
    const ts = Number(data.updatedAt ?? Date.now());
    await q`INSERT INTO journeys (id, user_id, data, updated_at) VALUES (${data.id}, ${g.user.uid}, ${JSON.stringify(data)}::jsonb, ${ts})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at WHERE journeys.user_id = ${g.user.uid}`;
  } else {
    const ts = Number(data.at ?? Date.now());
    await q`INSERT INTO notifications (id, user_id, data, at) VALUES (${data.id}, ${g.user.uid}, ${JSON.stringify(data)}::jsonb, ${ts})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, at = EXCLUDED.at WHERE notifications.user_id = ${g.user.uid}`;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const g = await guard(collection);
  if ("error" in g) return g.error;
  const { id } = (await req.json()) as { id: string };
  const q = sql();
  if (g.col === "journeys") await q`DELETE FROM journeys WHERE id = ${id} AND user_id = ${g.user.uid}`;
  else await q`DELETE FROM notifications WHERE id = ${id} AND user_id = ${g.user.uid}`;
  return NextResponse.json({ ok: true });
}
