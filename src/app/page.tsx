"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

/** الشاشة 12: الشاشة التمهيدية */
export default function Splash() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden hero-mountains">
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-primary-dark/80" />
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        <LogoMark size={120} />
        <h1 className="mt-4 text-5xl font-bold text-primary-dark">شمال</h1>
        <p className="text-sm text-primary-dark/80 mt-1">خدماتك الحكومية .. بأسهل طريقة</p>
        <h2 className="mt-12 text-3xl font-bold text-white leading-snug drop-shadow">
          من احتياجك ..
          <br />
          إلى خطوتك التالية
        </h2>
        <p className="mt-3 text-white/90 text-sm max-w-xs">
          رحلة ذكية لمعرفتك الحكومية في منطقة الحدود الشمالية
        </p>
      </div>
      <div className="relative px-6 pb-10">
        <Link href={user ? "/home" : "/login"} className="btn-primary text-lg shadow-lg">
          ابدأ الآن <ArrowLeft size={20} />
        </Link>
      </div>
    </main>
  );
}
