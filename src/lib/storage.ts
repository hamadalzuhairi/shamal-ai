"use client";

/**
 * طبقة تخزين موحدة: API الخادم (Postgres) للمستخدمين الحقيقيين،
 * و localStorage للوضع التجريبي (معرّف المستخدم يبدأ بـ demo-).
 */
import type { Journey, Notification } from "./types";

const isDemo = (uid: string) => uid.startsWith("demo-");
const key = (uid: string, col: string) => `shamal:${uid}:${col}`;

function localList<T>(uid: string, col: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key(uid, col)) ?? "[]") as T[];
  } catch {
    return [];
  }
}
function localSave<T extends { id: string }>(uid: string, col: string, item: T) {
  const list = localList<T>(uid, col).filter((x) => x.id !== item.id);
  list.unshift(item);
  localStorage.setItem(key(uid, col), JSON.stringify(list));
}
function localDelete(uid: string, col: string, id: string) {
  const list = localList<{ id: string }>(uid, col).filter((x) => x.id !== id);
  localStorage.setItem(key(uid, col), JSON.stringify(list));
}

async function remoteList<T>(col: string): Promise<T[]> {
  const res = await fetch(`/api/data/${col}`, { cache: "no-store" });
  if (!res.ok) return [];
  return ((await res.json()) as { items: T[] }).items;
}
async function remoteSave(col: string, item: unknown) {
  await fetch(`/api/data/${col}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ item }) });
}
async function remoteDelete(col: string, id: string) {
  await fetch(`/api/data/${col}`, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
}

/* ---------- الرحلات ---------- */
export async function listJourneys(uid: string): Promise<Journey[]> {
  if (isDemo(uid)) return localList<Journey>(uid, "journeys").sort((a, b) => b.updatedAt - a.updatedAt);
  return remoteList<Journey>("journeys");
}

export async function getJourney(uid: string, id: string): Promise<Journey | null> {
  const all = await listJourneys(uid);
  return all.find((j) => j.id === id) ?? null;
}

export async function saveJourney(j: Journey): Promise<void> {
  if (isDemo(j.userId)) return localSave(j.userId, "journeys", j);
  await remoteSave("journeys", j);
}

export async function deleteJourney(uid: string, id: string): Promise<void> {
  if (isDemo(uid)) return localDelete(uid, "journeys", id);
  await remoteDelete("journeys", id);
}

/* ---------- الإشعارات ---------- */
export async function listNotifications(uid: string): Promise<Notification[]> {
  if (isDemo(uid)) return localList<Notification>(uid, "notifications").sort((a, b) => b.at - a.at);
  return remoteList<Notification>("notifications");
}

export async function saveNotification(n: Notification): Promise<void> {
  if (isDemo(n.userId)) return localSave(n.userId, "notifications", n);
  await remoteSave("notifications", n);
}

export async function pushNotification(uid: string, n: Omit<Notification, "id" | "userId" | "read" | "at">): Promise<void> {
  await saveNotification({
    ...n,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    userId: uid,
    read: false,
    at: Date.now(),
  });
}
