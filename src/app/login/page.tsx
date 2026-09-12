"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LogoFull } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const { signIn, demoMode } = useAuth();
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

      {demoMode && (
        <p className="text-[11px] text-muted text-center mt-4 bg-warn-soft rounded-xl px-3 py-2">
          الوضع التجريبي: قاعدة البيانات غير مضبوطة، سيتم حفظ الحساب محلياً على هذا الجهاز.
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
