"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { serviceIcon } from "@/lib/icons";
import { EmptyState, Page, Spinner, StatusPill, TopBar } from "@/components/ui";
import { useJourney } from "@/lib/hooks/useJourneys";
import { computeReadiness } from "@/lib/engine";
import { getEntity, getService } from "@/lib/kb";

/** الشاشة 3: رحلتك — خطوات مرتبة حسب التبعيات */
export default function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { journey, loading } = useJourney(id);

  if (loading) return <Spinner />;
  if (!journey)
    return (
      <>
        <TopBar title="رحلتك" back="/home" />
        <Page>
          <EmptyState title="الرحلة غير موجودة" />
        </Page>
      </>
    );

  const done = journey.steps.filter((s) => s.status === "done").length;
  const readiness = computeReadiness(journey);

  return (
    <>
      <TopBar title="رحلتك" back="/home" />
      <Page>
        <p className="text-sm text-muted">تم تحديد مسارك بناءً على احتياجك</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="text-xs text-muted whitespace-nowrap">
            {done} من {journey.steps.length}
          </div>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${(done / journey.steps.length) * 100}%` }} />
          </div>
        </div>

        <div className="card mt-4 p-4">
          <div className="text-xs text-muted">الاحتياج</div>
          <div className="font-bold">{journey.title}</div>
          <div className="text-xs text-muted mt-1">«{journey.need}»</div>
        </div>

        <ol className="mt-4 relative">
          <div className="absolute top-4 bottom-4 right-[19px] w-0.5 bg-border" />
          {journey.steps.map((st) => {
            const svc = getService(st.serviceId);
            if (!svc) return null;
            const ent = getEntity(svc.entityId);
            const Icon = serviceIcon(svc.id);
            const isCurrent = st.status === "current" || st.status === "blocked";
            return (
              <li key={st.serviceId} className="relative flex gap-3 mb-3">
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border-2 ${
                    st.status === "done"
                      ? "bg-primary border-primary text-white"
                      : isCurrent
                        ? "bg-primary-soft border-primary text-primary"
                        : "bg-surface border-border text-muted"
                  }`}
                >
                  {st.status === "done" ? <Check size={18} /> : st.status === "upcoming" ? <Lock size={14} /> : st.order}
                </div>
                <Link
                  href={isCurrent ? `/journey/${journey.id}/ready` : `/services/${svc.id}`}
                  className={`card flex-1 p-3 flex items-center gap-3 ${isCurrent ? "border-primary/50 bg-primary-soft/40" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{svc.name}</div>
                    <div className="text-xs text-muted">{ent?.name}</div>
                    <div className="mt-1">
                      {st.status === "done" && <span className="text-[11px] text-ok font-bold">مكتمل</span>}
                      {isCurrent && <StatusPill level={readiness.level} label={readiness.label} />}
                      {st.status === "upcoming" && <span className="text-[11px] text-muted">قادم</span>}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-primary">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        <Link href={`/journey/${journey.id}/ready`} className="btn-primary mt-4">
          جاهز؟ افحص متطلبات الخطوة الحالية <ArrowLeft size={18} />
        </Link>
      </Page>
    </>
  );
}
