"use client";

/**
 * طبقة تخزين موحدة: Firestore عند توفر Firebase، وإلا localStorage.
 * تُخزن الرحلات والإشعارات لكل مستخدم.
 */
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase/client";
import type { Journey, Notification } from "./types";

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

/* ---------- الرحلات ---------- */
export async function listJourneys(uid: string): Promise<Journey[]> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "journeys"), where("userId", "==", uid), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Journey);
  }
  return localList<Journey>(uid, "journeys").sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getJourney(uid: string, id: string): Promise<Journey | null> {
  const all = await listJourneys(uid);
  return all.find((j) => j.id === id) ?? null;
}

export async function saveJourney(j: Journey): Promise<void> {
  if (firebaseEnabled && db) {
    await setDoc(doc(db, "journeys", j.id), j);
    return;
  }
  localSave(j.userId, "journeys", j);
}

export async function deleteJourney(uid: string, id: string): Promise<void> {
  if (firebaseEnabled && db) {
    await deleteDoc(doc(db, "journeys", id));
    return;
  }
  localDelete(uid, "journeys", id);
}

/* ---------- الإشعارات ---------- */
export async function listNotifications(uid: string): Promise<Notification[]> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "notifications"), where("userId", "==", uid), orderBy("at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Notification);
  }
  return localList<Notification>(uid, "notifications").sort((a, b) => b.at - a.at);
}

export async function saveNotification(n: Notification): Promise<void> {
  if (firebaseEnabled && db) {
    await setDoc(doc(db, "notifications", n.id), n);
    return;
  }
  localSave(n.userId, "notifications", n);
}

export async function pushNotification(
  uid: string,
  n: Omit<Notification, "id" | "userId" | "read" | "at">,
): Promise<void> {
  await saveNotification({
    ...n,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    userId: uid,
    read: false,
    at: Date.now(),
  });
}
