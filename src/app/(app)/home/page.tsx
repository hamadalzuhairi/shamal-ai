"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Car, Contact, FileBadge, Keyboard, Mic, Plane, Sparkles } from "lucide-react";
import { NotificationBell, Page, SectionTitle, TopBar } from "@/components/ui";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/firebase/auth-context";
import { useSpeech } from "@/lib/hooks/useSpeech";
import { useJourneys, useNotifications } from "@/lib/hooks/useJourneys";
import { getService } from "@/lib/kb";

const QUICK = [
  { id: "commercial-register", label: "إصدار سجل تجاري", sub: "وزارة التجارة", icon: FileBadge },
  { id: "driving-license", label: "إصدار رخصة قيادة", sub: "المرور", icon: Car },
  { id: "passport-issue", label: "إصدار جواز سفر", sub: "الجوازات", icon: Plane },
  { id: "national-id-issue", label: "إصدار هوية وطنية", sub: "الأحوال المدنية", icon: Contact },
];

const EXAMPLES = ["أبي أبدأ مشروع وما أعرف وش أحتاج", "هويتي منتهية وش أسوي؟", "أبي أجيب أهلي زيارة", "اشتريت سيارة وأبي أنقل ملكيتها"];

/** الشاشة 1: الرئيسية — «وش تحتاج؟» */
export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [need, setNeed] = useState("");
  const { unread } = useNotifications();
  const { journeys } = useJourneys();
  const speech = useSpeech((text) => {
    setNeed(text);
    go(text);
  });

  const go = (text: string) => {
    const t = text.trim();
    if (!t) return;
    router.push(`/understand?need=${encodeURIComponent(t)}`);
  };

  const active = journeys.find((j) => j.steps.some((s) => s.status !== "done"));

  return (
    <>
      <TopBar showLogo right={<NotificationBell count={unread} />} />
      <Page>
        {/* بطاقة الترحيب */}
        <section className="hero-mountains rounded-3xl overflow-hidden text-white p-5 mt-1">
          <div className="text-sm opacity-90">أهلاً بك في</div>
          <div className="text-2xl font-bold">شمال AI</div>
          <p className="text-xs opacity-90 mt-2 max-w-[240px]">
            مساعدك الذكي للوصول إلى الخدمات الحكومية في منطقة الحدود الشمالية.
          </p>
          {user && <div className="text-xs mt-3 opacity-80">مرحباً {user.name} 👋</div>}
        </section>

        {/* مربع الاحتياج */}
        <section className="card mt-4 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-soft flex items-center justify-center text-primary shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <div className="font-bold">وش تحتاج؟</div>
              <div className="text-xs text-muted">اكتب طلبك أو تحدث معنا</div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(need);
            }}
            className="mt-3"
          >
            <textarea
              value={speech.listening ? speech.interim || need : need}
              onChange={(e) => setNeed(e.target.value)}
              rows={2}
              placeholder="مثال: أبي أبدأ مشروع وما أعرف وش أحتاج"
              className="w-full resize-none rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {speech.error && <div className="text-danger text-xs mt-1">{speech.error}</div>}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={speech.toggle}
                className={`btn-ghost ${speech.listening ? "recording !bg-danger !text-white !border-danger" : ""}`}
              >
                <Mic size={18} /> {speech.listening ? "جارٍ الاستماع..." : "تحدث صوتياً"}
              </button>
              <button type="submit" className="btn-primary !py-3">
                <Keyboard size={18} /> اكتب طلبك
              </button>
            </div>
          </form>
          <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3 -mx-1 px-1">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => go(ex)} className="chip text-xs">
                {ex}
              </button>
            ))}
          </div>
        </section>

        {/* رحلتك الحالية */}
        {active && (
          <Link href={`/journey/${active.id}`} className="card mt-4 p-4 flex items-center gap-3 block">
            <LogoMark size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted">رحلتك الحالية</div>
              <div className="font-bold truncate">{active.title}</div>
              <div className="text-xs text-muted truncate">
                الخطوة الحالية: {getService(active.steps.find((s) => s.status !== "done")?.serviceId ?? "")?.name}
              </div>
            </div>
            <ArrowLeft className="text-primary" size={20} />
          </Link>
        )}

        {/* أكثر الخدمات طلباً */}
        <SectionTitle
          action={
            <Link href="/services" className="text-xs text-primary font-bold">
              عرض الكل
            </Link>
          }
        >
          أكثر الخدمات طلباً
        </SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {QUICK.map(({ id, label, sub, icon: Icon }) => (
            <Link key={id} href={`/services/${id}`} className="card p-2 flex flex-col items-center text-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <Icon size={20} />
              </div>
              <div className="text-[11px] font-bold leading-tight">{label}</div>
              <div className="text-[10px] text-muted">{sub}</div>
            </Link>
          ))}
        </div>

        {/* بانر */}
        <section className="mt-4 rounded-3xl bg-primary-soft p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-bold text-primary-dark">خدماتك في مكان واحد</div>
            <p className="text-xs text-muted mt-1">
              نفهم احتياجك، نبني رحلتك، نكشف النواقص قبل التقديم، ونحدد خطوتك التالية.
            </p>
          </div>
          <LogoMark size={56} />
        </section>
      </Page>
    </>
  );
}
