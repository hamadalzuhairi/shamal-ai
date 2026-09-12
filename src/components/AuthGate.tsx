"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { Spinner } from "./ui";

/** يحمي الصفحات الداخلية: يحوّل غير المسجلين إلى صفحة الدخول */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [loading, user, router, path]);

  if (loading || !user) return <Spinner label="جارٍ التحميل..." />;
  return <>{children}</>;
}
