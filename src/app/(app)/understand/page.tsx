"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Mic, Sparkles } from "lucide-react";
import { Page, Spinner, TopBar } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { createJourney, uid } from "@/lib/engine";
import { getScenario, SCENARIOS } from "@/lib/kb";
import { pushNotification, saveJourney } from "@/lib/storage";
import type { IntentResult } from "@/lib/types";

/** الشاشة 2: فهمنا احتياجك — ملخص + أسئلة توضيحية */
function Understand() {
  const params = useSearchParams();
  const need = params.get("need") ?? "";
  const router = useRouter();
  const { user } = useAuth();
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [chosen, setChosen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!need) {
      router.replace("/home");
      return;
    }
    fetch("/api/understand", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ need }) })
      .then((r) => r.json())
      .then((r: IntentResult) => {
        setIntent(r);
        setChosen(r.scenarioId);
      })
      .catch(() => setIntent({ scenarioId: null, confidence: 0, summary: "تعذر الاتصال بالخادم.", questions: [], source: "rules" }));
  }, [need, router]);

  const scenario = chosen ? getScenario(chosen) : null;
  const questions = scenario?.questions ?? [];
  const requiredAnswered = questions.filter((q) => !q.optional).every((q) => answers[q.id]);

  const proceed = async () => {
    if (!user || !scenario) return;
    setBusy(true);
    const j = createJourney({ id: uid(), userId: user.uid, scenarioId: scenario.id, need, answers });
    j.messages = [
      { id: uid(), role: "user", text: need, at: Date.now() },
      { id: uid(), role: "assistant", text: `فهمت طلبك: ${scenario.summary}. بنيت لك رحلة من ${j.steps.length} خطوة.`, at: Date.now() },
    ];
    await saveJourney(j);
    await pushNotification(user.uid, {
      title: "تم إنشاء رحلتك",
      body: `${scenario.title}: ${j.steps.length} خطوات مرتبة حسب التبعيات.`,
      kind: "success",
      journeyId: j.id,
    });
    router.replace(`/journey/${j.id}`);
  };

  return (
    <>
      <TopBar title="فهمنا احتياجك" back="/home" />
      <Page nav={false}>
        {/* ما قاله المستخدم */}
        <div className="card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-primary shrink-0">
            <Mic size={16} />
          </div>
          <div>
            <div className="font-bold text-sm">{need}</div>
            <div className="text-[11px] text-muted mt-1">(بمكنك الكتابة أو التحدث)</div>
          </div>
        </div>

        {!intent ? (
          <Spinner label="جارٍ فهم احتياجك..." />
        ) : (
          <>
            <div className="card p-4 mt-3">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={18} className="text-primary" /> تم فهم طلبك
              </div>
              <div className="text-sm mt-2">
                <span className="text-muted">الاحتياج: </span>
                <span className="font-bold">{scenario ? scenario.title : intent.summary}</span>
              </div>
              {intent.source === "llm" && (
                <div className="text-[11px] text-muted mt-1">تم الفهم بواسطة النموذج اللغوي · الثقة {Math.round(intent.confidence * 100)}%</div>
              )}

              {/* إن لم يُفهم الاحتياج: اختيار يدوي */}
              {!scenario && (
                <div className="mt-3">
                  <div className="text-sm text-muted mb-2">اختر الأقرب لاحتياجك:</div>
                  <div className="flex flex-wrap gap-2">
                    {SCENARIOS.map((s) => (
                      <button key={s.id} onClick={() => setChosen(s.id)} className="chip">
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {scenario && (
                <button onClick={() => setChosen(null)} className="text-xs text-primary mt-3">
                  ليس هذا احتياجي؟ اختر غيره
                </button>
              )}
            </div>

            {scenario && questions.length > 0 && (
              <div className="card p-4 mt-3">
                <div className="font-bold">معلومات إضافية نحتاجها</div>
                <div className="space-y-4 mt-3">
                  {questions.map((q) => (
                    <div key={q.id}>
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {q.question}
                        {q.optional && <span className="text-[10px] text-muted">(اختياري)</span>}
                      </div>
                      {q.options ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {q.options.map((o) => (
                            <button
                              key={o}
                              onClick={() => setAnswers({ ...answers, [q.id]: o })}
                              className={`chip ${answers[q.id] === o ? "chip-active" : ""}`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <button className="btn-primary" disabled={!scenario || !requiredAnswered || busy} onClick={proceed}>
                {busy ? "جارٍ بناء رحلتك..." : "متابعة"} <ArrowLeft size={18} />
              </button>
              {scenario && !requiredAnswered && <p className="text-xs text-muted text-center mt-2">أجب عن الأسئلة الأساسية للمتابعة</p>}
            </div>
          </>
        )}
      </Page>
    </>
  );
}

export default function UnderstandPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Understand />
    </Suspense>
  );
}
