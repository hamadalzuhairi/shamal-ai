"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { getJourney, listJourneys, listNotifications, saveJourney } from "@/lib/storage";
import type { Journey, Notification } from "@/lib/types";

export function useJourneys() {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    if (!user) return;
    setJourneys(await listJourneys(user.uid));
    setLoading(false);
  }, [user]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { journeys, loading, refresh };
}

export function useJourney(id: string) {
  const { user } = useAuth();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getJourney(user.uid, id).then((j) => {
      setJourney(j);
      setLoading(false);
    });
  }, [user, id]);

  const update = useCallback(async (next: Journey) => {
    setJourney(next);
    await saveJourney(next);
  }, []);

  return { journey, loading, update };
}

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const refresh = useCallback(async () => {
    if (!user) return;
    setItems(await listNotifications(user.uid));
  }, [user]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { items, refresh, unread: items.filter((n) => !n.read).length };
}
