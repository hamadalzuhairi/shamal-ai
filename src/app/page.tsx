"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { IMAGES } from "@/lib/images";

/** الشاشة 12: الشاشة التمهيدية — صورة جبال ضبابية هادئة كما في التصميم */
export default function Splash() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-[#e9eeee]">
      {/* الصورة مخففة الإضاءة والتشبع لتعطي إحساساً ضبابياً هادئاً */}
      <div
        className="absolute inset-0 photo-cover"
        style={{ backgroundImage: `url(${IMAGES.splash})`, backgroundPosition: "center 70%", filter: "saturate(0.55) brightness(0.82) contrast(0.85)" }}
      />
      {/* طبقة ضباب: فاتحة في الأعلى، شفافة في الوسط، ضباب أبيض خفيف في الأسفل */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e9eeee]/95 via-[#e9eeee]/55 to-[#e9eeee]/20" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/75 to-transparent" />

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
