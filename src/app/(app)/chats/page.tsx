"use client";

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { serviceIcon } from "@/lib/icons";
import { getScenario } from "@/lib/kb";
import { EmptyState, Page, Spinner, TopBar } from "@/components/ui";
import { useJourneys } from "@/lib/hooks/useJourneys";
import { saveJourney } from "@/lib/storage";
import { getService } from "@/lib/kb";

function relTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString("ar-SA-u-nu-latn", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "أمس";
  return d.toLocaleDateString("ar-SA-u-nu-latn", { month: "numeric", day: "numeric" });
}

/** الشاشة 8: المحادثات — الرحلات السابقة ومتابعتها */
export default function ChatsPage() {
  const { journeys, loading, refresh } = useJourneys();
  const [tab, setTab] = useState<"all" | "fav">("all");
  const list = tab === "fav" ? journeys.filter((j) => j.favorite) : journeys;

  const toggleFav = async (id: string) => {
    const j = journeys.find((x) => x.id === id);
    if (!j) return;
    await saveJourney({ ...j, favorite: !j.favorite });
    refresh();
  };

  return (
    <>
      <TopBar title="المحادثات" />
      <Page>
        <div className="flex gap-2">
          <button onClick={() => setTab("all")} className={`chip ${tab === "all" ? "chip-active" : ""}`}>
            الكل
          </button>
          <button onClick={() => setTab("fav")} className={`chip ${tab === "fav" ? "chip-active" : ""}`}>
            المفضلة
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState
            title="لا توجد محادثات بعد"
            body="ابدأ بكتابة احتياجك في الصفحة الرئيسية وسنبني لك رحلتك."
            action={
              <Link href="/home" className="btn-primary">
                ابدأ الآن
              </Link>
            }
          />
        ) : (
          <ul className="mt-4 space-y-2">
            {list.map((j) => {
              const last = j.messages[j.messages.length - 1];
              const cur = j.steps.find((s) => s.status !== "done");
              const done = !cur;
              const Icon = serviceIcon(cur?.serviceId ?? getScenario(j.scenarioId)?.serviceIds[0] ?? "");
              return (
                <li key={j.id} className="card p-3 flex items-center gap-3">
                  <Link href={`/journey/${j.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{j.title}</div>
                      <div className="text-xs text-muted truncate">
                        {done ? "اكتملت الرحلة" : cur ? `الخطوة الحالية: ${getService(cur.serviceId)?.name}` : last?.text}
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] text-muted">{relTime(j.updatedAt)}</span>
                    <button onClick={() => toggleFav(j.id)} aria-label="مفضلة">
                      <Star size={16} className={j.favorite ? "fill-warn text-warn" : "text-muted"} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Page>
    </>
  );
}
