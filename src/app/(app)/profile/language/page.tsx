"use client";

import { Check } from "lucide-react";
import { Page, TopBar } from "@/components/ui";

export default function LanguagePage() {
  return (
    <>
      <TopBar title="اللغة" back="/profile" />
      <Page>
        <ul className="card mt-2 divide-y divide-border">
          <li className="flex items-center gap-3 p-4">
            <span className="flex-1 text-sm font-medium">العربية</span>
            <Check size={18} className="text-primary" />
          </li>
          <li className="flex items-center gap-3 p-4 opacity-50">
            <span className="flex-1 text-sm font-medium">English</span>
            <span className="text-[11px] text-muted">قريباً</span>
          </li>
        </ul>
        <p className="text-xs text-muted mt-3 px-1">يدعم التطبيق حالياً اللغة العربية بلهجة سعودية مبسطة لتناسب جميع الفئات.</p>
      </Page>
    </>
  );
}
