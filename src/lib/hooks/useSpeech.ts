"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* أنواع مبسطة لواجهة Web Speech API */
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** إدخال صوتي بالعربية عبر متصفح Chrome/Edge/Safari (Web Speech API) */
export function useSpeech(onFinal?: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;

  useEffect(() => {
    setSupported(Boolean(getCtor()));
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) {
      setError("المتصفح لا يدعم الإدخال الصوتي. جرّب Chrome أو Edge.");
      return;
    }
    setError(null);
    setInterim("");
    const rec = new Ctor();
    rec.lang = "ar-SA";
    rec.continuous = false;
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      setInterim(interimText || finalText);
    };
    rec.onerror = (e) => {
      const msgs: Record<string, string> = {
        "not-allowed": "لم يُسمح باستخدام المايكروفون.",
        "no-speech": "لم أسمع شيئاً، حاول مرة أخرى.",
        network: "تعذر الاتصال بخدمة التعرف على الصوت.",
        "audio-capture": "لم يتم العثور على مايكروفون.",
      };
      setError(msgs[e.error] ?? "حدث خطأ في الإدخال الصوتي.");
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      if (finalText.trim()) finalRef.current?.(finalText.trim());
      setInterim("");
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, []);

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  useEffect(() => () => recRef.current?.abort(), []);

  return { supported, listening, interim, error, start, stop, toggle };
}
