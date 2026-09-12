"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { PhotoBackdrop } from "@/components/PhotoBackdrop";

/** الشاشة 12: الشاشة التمهيدية — صورة جبال ضبابية هادئة كما في التصميم */
export default function Splash() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-[#e9eeee]">
      <PhotoBackdrop />

      <div className="relative flex-1 flex flex-col items-center pt-24 px-8 text-center">
        <div className="flex items-center gap-3" dir="rtl">
          <div className="leading-none">
            <div className="text-6xl font-bold text-primary-dark">شمال</div>
            <div className="text-xs text-primary-dark/80 mt-1">خدماتك الحكومية .. بأسهل طريقة</div>
          </div>
          <LogoMark size={96} />
        </div>

        <h2 className="mt-16 text-[28px] font-bold text-primary-dark leading-snug">
          من احتياجك ..
          <br />
          إلى خطوتك التالية
        </h2>
        <p className="mt-3 text-primary-dark/75 text-sm max-w-xs">رحلة ذكية لمعرفتك الحكومية في منطقة الحدود الشمالية</p>
      </div>

      <div className="relative px-6 pb-12">
        <Link href={user ? "/home" : "/login"} className="btn-primary text-lg shadow-xl">
          ابدأ الآن <ArrowLeft size={20} />
        </Link>
      </div>
    </main>
  );
}
