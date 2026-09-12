"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { AlertTriangle, ArrowLeft, Check, CircleHelp, HelpCircle, ShieldCheck, X } from "lucide-react";
import { EmptyState, Page, ReadinessRing, Spinner, StatusPill, TopBar } from "@/components/ui";
import { useJourney } from "@/lib/hooks/useJourneys";
import { useAuth } from "@/lib/auth-context";
import { completeCurrentStep, computeReadiness, currentStep, setRequirementStatus, stepRequirements, reqStatusOf } from "@/lib/engine";
import { getService } from "@/lib/kb";
import { pushNotification } from "@/lib/storage";
import type { Requirement } from "@/lib/types";
import { IMAGES } from "@/lib/images";

/** الشاشة 4: جاهز؟ — مؤشر الجاهزية وقائمة التحقق */
export default function ReadyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { journey, loading, update } = useJourney(id);
  const { user } = useAuth();
  const router = useRouter();

  if (loading) return <Spinner />;
  if (!journey)
    return (
      <>
        <TopBar title="جاهز؟" back="/home" />
        <Page>
          <EmptyState title="الرحلة غير موجودة" />
        </Page>
      </>
    );

  const step = currentStep(journey);
  const svc = step ? getService(step.serviceId) : null;
  const r = computeReadiness(journey, step);
  const reqs = step ? stepRequirements(journey, step) : [];

  const setStatus = (req: Requirement, status: "done" | "missing") => update(setRequirementStatus(journey, req.id, status));

  const finish = async () => {
    const next = completeCurrentStep(journey);
    await update(next);
    if (user && svc)
      await pushNotification(user.uid, { title: "تم إكمال خطوة", body: `تم إكمال «${svc.name}» بنجاح.`, kind: "success", journeyId: journey.id });
    router.push(`/journey/${journey.id}`);
  };

  const firstBlocker = [...r.blockedByPrereq, ...r.missing][0];

  return (
    <>
      <TopBar showLogo back={`/journey/${journey.id}`} />
      <Page className="relative">
        {/* خلفية جبال باهتة خلف مؤشر الجاهزية كما في التصميم */}
        <div
          className="absolute inset-x-0 top-0 h-[330px] -z-10 photo-cover opacity-30"
          style={{ backgroundImage: `url(${IMAGES.readiness})`, maskImage: "linear-gradient(to bottom, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent)" }}
        />
        <h1 className="text-2xl font-bold">جاهز للتقديم؟</h1>
        <p className="text-sm text-muted">تأكد من اكتمال المتطلبات قبل المتابعة</p>

        {!step || !svc ? (
          <EmptyState title="اكتملت رحلتك 🎉" body="أنجزت جميع الخطوات المطلوبة." />
        ) : (
          <>
            <div className="mt-5 flex flex-col items-center gap-3">
              <ReadinessRing percent={r.percent} level={r.level} size={150} />
              <div className="text-center">
                <div className="text-xs text-muted">الخطوة الحالية</div>
                <div className="font-bold text-sm">{svc.name}</div>
                <div className="mt-2">
                  <StatusPill level={r.level} label={r.label} />
                </div>
                <div className="text-[11px] text-muted mt-1">{r.hint}</div>
              </div>
            </div>

            {/* قائمة التحقق */}
            <div className="card mt-5 p-4 !bg-ok-soft/40 !border-ok/20">
              <div className="font-bold text-sm mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> قائمة التحقق
              </div>
              <ul className="space-y-2">
                {reqs.map((req) => {
                  const s = reqStatusOf(journey, req);
                  const isPrereq = req.kind === "prerequisite";
                  return (
                    <li
                      key={req.id}
                      className={`rounded-2xl border p-3 ${
                        s === "done" ? "border-ok/30 bg-ok-soft/40" : s === "missing" ? "border-danger/30 bg-danger-soft/40" : "border-border bg-surface-2"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {s === "done" ? (
                            <Check size={18} className="text-ok" />
                          ) : s === "missing" ? (
                            <AlertTriangle size={18} className="text-danger" />
                          ) : (
                            <CircleHelp size={18} className="text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold">{req.label}</div>
                          {req.description && <div className="text-xs text-muted mt-0.5">{req.description}</div>}
                          {isPrereq && s !== "done" && (
                            <div className="text-[11px] text-danger mt-1">خطوة سابقة في رحلتك لم تكتمل بعد</div>
                          )}
                          {!isPrereq && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => setStatus(req, "done")}
                                className={`chip text-xs !py-1 ${s === "done" ? "chip-active" : ""}`}
                              >
                                <Check size={12} className="inline ml-1" /> عندي
                              </button>
                              <button
                                onClick={() => setStatus(req, "missing")}
                                className={`chip text-xs !py-1 ${s === "missing" ? "!bg-danger !text-white !border-danger" : ""}`}
                              >
                                <X size={12} className="inline ml-1" /> ما عندي
                              </button>
                              {s === "missing" && req.obtain && (
                                <Link href={`/journey/${journey.id}/blocker?req=${req.id}`} className="chip text-xs !py-1 !text-primary font-bold">
                                  لو ما أقدر؟
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* حالة العوائق */}
            {firstBlocker ? (
              <Link
                href={`/journey/${journey.id}/blocker?req=${firstBlocker.id}`}
                className="card mt-3 p-4 flex items-center gap-3 !border-purple/30 !bg-purple-soft/60"
              >
                <div className="w-10 h-10 rounded-full bg-purple-soft text-purple flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-purple font-bold">ينقصك</div>
                  <div className="font-bold text-sm">{firstBlocker.label}</div>
                  <div className="text-[11px] text-muted">اضغط لعرض المسار الرسمي لمعالجة العائق</div>
                </div>
                <ArrowLeft className="text-purple" size={18} />
              </Link>
            ) : (
              <div className="card mt-3 p-4 flex items-center gap-3 border-ok/30 bg-ok-soft/40">
                <div className="w-10 h-10 rounded-full bg-ok-soft text-ok flex items-center justify-center shrink-0">
                  <Check size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{r.unknown.length ? "حدّد حالة المتطلبات" : "لا توجد عوائق حالياً"}</div>
                  <div className="text-[11px] text-muted">
                    {r.unknown.length ? "اختر «عندي» أو «ما عندي» لكل متطلب" : "يمكنك الآن المتابعة في رحلتك"}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Link href={`/journey/${journey.id}/next`} className="btn-primary">
                خطوتك التالية <ArrowLeft size={18} />
              </Link>
              {r.level === "green" && (
                <button onClick={finish} className="btn-ghost">
                  <Check size={18} /> أنجزت هذه الخطوة
                </button>
              )}
              <Link href={`/journey/${journey.id}/chat`} className="btn-ghost !border-transparent !bg-transparent text-sm">
                <HelpCircle size={16} /> عندي سؤال عن هذه الخطوة
              </Link>
            </div>
          </>
        )}
      </Page>
    </>
  );
}
