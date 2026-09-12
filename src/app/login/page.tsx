"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LogoFull } from "@/components/Logo";
import { useAuth } from "@/lib/firebase/auth-context";

function LoginForm() {
  const { signIn, signInWithGoogle, demoMode } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      router.replace(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col px-6 pt-14 pb-8">
      <div className="flex justify-center">
        <LogoFull size={64} />
      </div>
      <h1 className="text-2xl font-bold mt-10">أهلاً بك من جديد</h1>
      <p className="text-muted text-sm mt-1">سجّل دخولك لمتابعة رحلتك الحكومية.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">البريد الإلكتروني</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary"
            placeholder="name@example.com"
            dir="ltr"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">كلمة المرور</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary"
            placeholder="••••••••"
            dir="ltr"
          />
        </label>
        {error && <div className="text-danger text-sm bg-danger-soft rounded-xl px-3 py-2">{error}</div>}
        <button className="btn-primary" disabled={busy}>
          {busy ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5 text-muted text-xs">
        <div className="flex-1 h-px bg-border" />
        أو
        <div className="flex-1 h-px bg-border" />
      </div>
      <button
        onClick={async () => {
          setError(null);
          try {
            await signInWithGoogle();
            router.replace(next);
          } catch (err) {
            setError((err as Error).message);
          }
        }}
        className="btn-ghost"
      >
        <GoogleIcon /> المتابعة عبر Google
      </button>

      {demoMode && (
        <p className="text-[11px] text-muted text-center mt-4 bg-warn-soft rounded-xl px-3 py-2">
          الوضع التجريبي: لم يتم ضبط Firebase بعد، سيتم حفظ الحساب محلياً على هذا الجهاز.
        </p>
      )}

      <p className="text-center text-sm text-muted mt-auto pt-8">
        ما عندك حساب؟{" "}
        <Link href="/register" className="text-primary font-bold">
          أنشئ حساباً
        </Link>
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
