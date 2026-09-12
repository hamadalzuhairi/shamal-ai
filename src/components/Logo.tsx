/**
 * شعار "شمال AI" — نسخة متجهية (SVG) مُعاد رسمها من التصميم الأصلي:
 * خريطة المملكة بخط أخضر مزرق، نخلة وجبال في الداخل، والنص "شمال AI" مع الشعار الفرعي.
 */
export function LogoMark({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار شمال AI"
    >
      <defs>
        <linearGradient id="lg-teal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f7f7b" />
          <stop offset="1" stopColor="#17504e" />
        </linearGradient>
        <linearGradient id="lg-mtn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fbcb9" />
          <stop offset="1" stopColor="#2f7f7b" />
        </linearGradient>
        <clipPath id="ksa-clip">
          <path d="M14 26 L30 16 L44 14 L52 18 L60 12 L72 14 L86 24 L92 34 L88 44 L84 50 L86 58 L82 66 L70 74 L58 80 L48 88 L40 86 L36 78 L30 70 L24 64 L16 54 L12 44 Z" />
        </clipPath>
      </defs>
      {/* خريطة المملكة (مبسطة) */}
      <path
        d="M14 26 L30 16 L44 14 L52 18 L60 12 L72 14 L86 24 L92 34 L88 44 L84 50 L86 58 L82 66 L70 74 L58 80 L48 88 L40 86 L36 78 L30 70 L24 64 L16 54 L12 44 Z"
        stroke="url(#lg-teal)"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="#ffffff"
        fillOpacity="0.55"
      />
      <g clipPath="url(#ksa-clip)">
        {/* جبال */}
        <path d="M18 74 L36 50 L46 62 L54 46 L70 70 L82 62 L92 78 L92 96 L8 96 Z" fill="url(#lg-mtn)" />
        <path d="M30 74 L40 60 L48 72 L58 56 L72 76 Z" fill="#cfe3e1" opacity="0.7" />
        {/* رمال / أمواج */}
        <path d="M8 84 Q30 78 50 84 T92 84 L92 96 L8 96 Z" fill="#17504e" opacity="0.35" />
      </g>
      {/* نخلة */}
      <path d="M50 44 L50 62" stroke="#17504e" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M50 44 C44 38 38 40 34 44 C40 43 46 45 50 44 Z M50 44 C56 38 62 40 66 44 C60 43 54 45 50 44 Z M50 44 C46 36 46 30 50 26 C51 32 51 38 50 44 Z M50 44 C42 44 38 48 36 52 C42 49 47 46 50 44 Z M50 44 C58 44 62 48 64 52 C58 49 53 46 50 44 Z"
        fill="#1f6a68"
      />
    </svg>
  );
}

export function LogoFull({
  size = 44,
  showTagline = true,
  light = false,
}: {
  size?: number;
  showTagline?: boolean;
  light?: boolean;
}) {
  const color = light ? "#ffffff" : "#1f6a68";
  const sub = light ? "rgba(255,255,255,0.85)" : "#6b7f7e";
  return (
    <div className="flex items-center gap-2" dir="rtl">
      <LogoMark size={size} />
      <div className="leading-tight">
        <div
          className="font-bold"
          style={{ color, fontSize: size * 0.5, letterSpacing: "-0.5px" }}
        >
          شمال <span style={{ fontFamily: "system-ui, sans-serif" }}>AI</span>
        </div>
        {showTagline && (
          <div style={{ color: sub, fontSize: Math.max(9, size * 0.22) }}>
            خدماتك الحكومية .. بأسهل طريقة
          </div>
        )}
      </div>
    </div>
  );
}
