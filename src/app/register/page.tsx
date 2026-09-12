"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoFull } from "@/components/Logo";
import { PhotoBackdrop } from "@/components/PhotoBackdrop";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/home");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input = "mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary";

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-[#e9eeee] px-5 pt-14 pb-8">
      <PhotoBackdrop />
      <div className="relative flex justify-center">
        <LogoFull size={64} />
      </div>
      <div className="relative card mt-8 p-5 !bg-white/90 backdrop-blur-sm">
      <h1 className="text-2xl font-bold">أنشئ حسابك</h1>
      <p className="text-muted text-sm mt-1">حساب واحد لحفظ رحلاتك ومتابعة خطواتك.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">الاسم</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="اسمك الكامل" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">البريد الإلكتروني</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="name@example.com" dir="ltr" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">كلمة المرور</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="6 أحرف على الأقل" dir="ltr" />
        </label>
        {error && <div className="text-danger text-sm bg-danger-soft rounded-xl px-3 py-2">{error}</div>}
        <button className="btn-primary" disabled={busy}>
          {busy ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>

      </div>
      <p className="relative text-center text-sm text-primary-dark mt-auto pt-8">
        عندك حساب؟{" "}
        <Link href="/login" className="text-primary font-bold">
          سجّل دخولك
        </Link>
      </p>
    </main>
  );
}
