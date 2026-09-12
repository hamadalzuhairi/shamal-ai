"use client";

import { useState } from "react";
import { Page, TopBar } from "@/components/ui";
import { useAuth } from "@/lib/firebase/auth-context";

const CITIES = ["عرعر", "رفحاء", "طريف", "العويقيلة", "أخرى"];
const PREF_KEY = "shamal:prefs";

export default function PersonalInfoPage() {
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [prefs, setPrefs] = useState<{ city?: string; residency?: string; phone?: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await updateName(name.trim() || user?.name || "");
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const input = "mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <>
      <TopBar title="معلوماتي الشخصية" back="/profile" />
      <Page>
        <div className="card p-4 space-y-4 mt-2">
          <label className="block">
            <span className="text-sm font-medium">الاسم</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">البريد الإلكتروني</span>
            <input value={user?.email ?? ""} disabled className={`${input} opacity-60`} dir="ltr" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">رقم الجوال</span>
            <input value={prefs.phone ?? ""} onChange={(e) => setPrefs({ ...prefs, phone: e.target.value })} className={input} placeholder="05xxxxxxxx" dir="ltr" />
          </label>
          <div>
            <span className="text-sm font-medium">المدينة</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {CITIES.map((c) => (
                <button key={c} onClick={() => setPrefs({ ...prefs, city: c })} className={`chip ${prefs.city === c ? "chip-active" : ""}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">الصفة</span>
            <div className="flex gap-2 mt-2">
              {[
                ["citizen", "مواطن"],
                ["resident", "مقيم"],
              ].map(([v, l]) => (
                <button key={v} onClick={() => setPrefs({ ...prefs, residency: v })} className={`chip ${prefs.residency === v ? "chip-active" : ""}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={save} className="btn-primary mt-4">
          {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
        </button>
      </Page>
    </>
  );
}
