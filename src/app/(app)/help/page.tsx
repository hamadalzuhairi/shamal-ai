"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, HelpCircle, Mail, Star } from "lucide-react";
import { Page, TopBar } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

const FAQ = [
  { q: "ما هو شمال AI؟", a: "منصة ذكية تحوّل وصفك لاحتياجك الحكومي إلى رحلة إجرائية واضحة: تفهم قصدك، تحدد الخدمات، ترتب الخطوات، تكشف النواقص، وتحدد خطوتك التالية." },
  { q: "هل يقدّم التطبيق الخدمة بدلاً عني؟", a: "لا. شمال AI طبقة إرشادية فوق القنوات الرسمية (أبشر، بلدي، المركز السعودي للأعمال...). كل إجراء يتم عبر القناة الرسمية بزر انتقال مباشر." },
  { q: "وش يعني «لو ما أقدر؟»", a: "إذا نقصك مستند أو شرط، يشرح لك التطبيق السبب ويقترح المسار الرسمي للحصول عليه، ثم يعيدك إلى رحلتك عند اكتماله." },
  { q: "كيف يُحسب مؤشر الجاهزية؟", a: "🟢 جاهز للتقديم عند اكتمال كل المتطلبات، 🟡 يحتاج إكمال عند وجود مستند ناقص، 🔴 لا تبدأ الآن عند وجود خطوة سابقة لم تكتمل." },
  { q: "هل معلومات الخدمات محدثة؟", a: "تُبنى قاعدة المعرفة من المصادر الحكومية الرسمية وتعرض روابطها في صفحة كل خدمة. تحقق دائماً من القناة الرسمية قبل التقديم." },
  { q: "هل بياناتي محفوظة؟", a: "نحفظ رحلاتك وحالة المتطلبات التي تحددها فقط، ولا نطلب أو نخزن مستنداتك الرسمية." },
];

/** الشاشة 11: المساعدة والدعم */
export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [showFaq, setShowFaq] = useState(true);

  return (
    <>
      <TopBar title="المساعدة والدعم" back="/profile" />
      <Page>
        <ul className="card mt-2 divide-y divide-border">
          <li>
            <button onClick={() => setShowFaq(!showFaq)} className="flex items-center gap-3 p-4 w-full">
              <HelpCircle size={20} className="text-primary" />
              <span className="flex-1 text-sm font-medium text-right">الأسئلة الشائعة</span>
              <ChevronDown size={18} className={`text-muted transition ${showFaq ? "rotate-180" : ""}`} />
            </button>
            {showFaq && (
              <ul className="px-4 pb-2 space-y-1">
                {FAQ.map((f, i) => (
                  <li key={i} className="rounded-xl bg-surface-2">
                    <button onClick={() => setOpen(open === i ? null : i)} className="flex items-center gap-2 w-full p-3 text-right">
                      <span className="flex-1 text-sm">{f.q}</span>
                      <ChevronDown size={16} className={`text-muted transition ${open === i ? "rotate-180" : ""}`} />
                    </button>
                    {open === i && <p className="text-xs text-muted px-3 pb-3">{f.a}</p>}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <a href="mailto:support@shamal.ai" className="flex items-center gap-3 p-4">
              <Mail size={20} className="text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-medium">تواصل معنا</span>
                <span className="block text-xs text-muted" dir="ltr">
                  support@shamal.ai
                </span>
              </span>
              <ChevronLeft size={18} className="text-muted" />
            </a>
          </li>
          <li>
            <a href="https://my.gov.sa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4">
              <HelpCircle size={20} className="text-primary" />
              <span className="flex-1 text-sm font-medium">مركز المساعدة (المنصة الوطنية الموحدة)</span>
              <ChevronLeft size={18} className="text-muted" />
            </a>
          </li>
          <li>
            <button className="flex items-center gap-3 p-4 w-full" onClick={() => alert("شكراً لك! تقييمك يساعدنا على التحسين.")}>
              <Star size={20} className="text-primary" />
              <span className="flex-1 text-sm font-medium text-right">تقييم التطبيق</span>
              <ChevronLeft size={18} className="text-muted" />
            </button>
          </li>
        </ul>

        <div className="mt-8 rounded-3xl hero-mountains text-white p-6 flex flex-col items-center">
          <LogoMark size={56} />
          <div className="font-bold mt-2">معك في كل خطوة</div>
        </div>
      </Page>
    </>
  );
}
