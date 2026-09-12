"use client";

import { use, useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";
import { EmptyState, Page, Spinner, TopBar } from "@/components/ui";
import { useJourney } from "@/lib/hooks/useJourneys";
import { useSpeech } from "@/lib/hooks/useSpeech";
import { uid } from "@/lib/engine";

/** محادثة داخل الرحلة: أسئلة سياقية عن الخطوة الحالية */
export default function JourneyChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { journey, loading, update } = useJourney(id);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const speech = useSpeech((t) => setText(t));

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [journey?.messages.length, busy]);

  if (loading) return <Spinner />;
  if (!journey)
    return (
      <>
        <TopBar title="المحادثة" back="/chats" />
        <Page>
          <EmptyState title="الرحلة غير موجودة" />
        </Page>
      </>
    );

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    setText("");
    const withUser = { ...journey, messages: [...journey.messages, { id: uid(), role: "user" as const, text: q, at: Date.now() }] };
    await update(withUser);
    setBusy(true);
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ journey: withUser, question: q }),
      });
      const { answer } = (await res.json()) as { answer: string };
      await update({ ...withUser, messages: [...withUser.messages, { id: uid(), role: "assistant", text: answer, at: Date.now() }], updatedAt: Date.now() });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title={journey.title} back={`/journey/${journey.id}`} />
      <Page nav={false} className="flex flex-col">
        <div className="flex-1 space-y-3 py-2">
          {journey.messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-primary text-white rounded-tr-sm" : "card rounded-tl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-end">
              <div className="card rounded-2xl px-4 py-3 flex gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          )}
          <div ref={bottom} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="sticky bottom-0 bg-bg pt-2 pb-2 flex gap-2"
        >
          <button
            type="button"
            onClick={speech.toggle}
            className={`w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center text-primary shrink-0 ${speech.listening ? "recording !bg-danger !text-white" : ""}`}
            aria-label="تحدث"
          >
            <Mic size={20} />
          </button>
          <input
            value={speech.listening ? speech.interim || text : text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اسأل عن هذه الخطوة..."
            className="flex-1 rounded-full border border-border bg-surface px-4 text-sm outline-none focus:border-primary"
          />
          <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0" aria-label="إرسال" disabled={busy}>
            <Send size={18} className="rotate-180" />
          </button>
        </form>
      </Page>
    </>
  );
}
