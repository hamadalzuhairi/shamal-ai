"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { serviceIcon } from "@/lib/icons";
import { Page, TopBar } from "@/components/ui";
import { CATEGORY_LABELS, getEntity, SERVICES } from "@/lib/kb";

const FILTERS = ["all", "business", "civil", "passports", "traffic", "housing", "labor", "tax", "social", "health"];

/** الشاشة 7: قائمة الخدمات */
export default function ServicesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const n = q.trim();
    return SERVICES.filter((s) => (cat === "all" || s.category === cat)).filter((s) => {
      if (!n) return true;
      const ent = getEntity(s.entityId);
      return s.name.includes(n) || ent?.name.includes(n) || s.keywords.some((k) => k.includes(n));
    });
  }, [q, cat]);

  return (
    <>
      <TopBar title="الخدمات" />
      <Page>
        <div className="relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن خدمة أو جهة"
            className="w-full rounded-full border border-border bg-surface pr-11 pl-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3 -mx-4 px-4">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setCat(f)} className={`chip ${cat === f ? "chip-active" : ""}`}>
              {CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {list.map((s) => {
            const ent = getEntity(s.entityId);
            const Icon = serviceIcon(s.id);
            return (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="card p-3 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{s.name}</div>
                    <div className="text-xs text-muted truncate">{ent?.name}</div>
                  </div>
                  <ChevronLeft size={18} className="text-muted" />
                </Link>
              </li>
            );
          })}
          {list.length === 0 && <li className="text-center text-sm text-muted py-10">لا توجد خدمات مطابقة</li>}
        </ul>
      </Page>
    </>
  );
}
