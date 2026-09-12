import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * قاعدة البيانات: Postgres (Neon عبر Vercel Storage).
 * عند غياب DATABASE_URL يعمل التطبيق بوضع تجريبي محلي في المتصفح.
 */
export const dbEnabled = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

let _sql: NeonQueryFunction<false, false> | null = null;
let _ready: Promise<void> | null = null;

export function sql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
  return _sql;
}

/** إنشاء الجداول عند أول استخدام */
export function ensureSchema(): Promise<void> {
  if (!_ready) {
    const q = sql();
    _ready = (async () => {
      await q`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at BIGINT NOT NULL
      )`;
      await q`CREATE TABLE IF NOT EXISTS journeys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        data JSONB NOT NULL,
        updated_at BIGINT NOT NULL
      )`;
      await q`CREATE INDEX IF NOT EXISTS journeys_user_idx ON journeys (user_id, updated_at DESC)`;
      await q`CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        data JSONB NOT NULL,
        at BIGINT NOT NULL
      )`;
      await q`CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, at DESC)`;
    })().catch((e) => {
      _ready = null;
      throw e;
    });
  }
  return _ready;
}
