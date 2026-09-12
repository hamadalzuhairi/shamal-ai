"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseEnabled } from "./client";
import type { UserProfile } from "@/lib/types";

interface AuthCtx {
  user: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const DEMO_KEY = "shamal:demo-user";

function arabicError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email": "البريد الإلكتروني غير صحيح.",
    "auth/user-not-found": "لا يوجد حساب بهذا البريد.",
    "auth/wrong-password": "كلمة المرور غير صحيحة.",
    "auth/invalid-credential": "بيانات الدخول غير صحيحة.",
    "auth/email-already-in-use": "البريد مستخدم مسبقاً.",
    "auth/weak-password": "كلمة المرور ضعيفة (6 أحرف على الأقل).",
    "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول.",
    "auth/network-request-failed": "تعذر الاتصال بالشبكة.",
  };
  return map[code] ?? "حدث خطأ، حاول مرة أخرى.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      // الوضع التجريبي: مستخدم محفوظ محلياً
      try {
        const raw = localStorage.getItem(DEMO_KEY);
        setUser(raw ? (JSON.parse(raw) as UserProfile) : null);
      } catch {
        setUser(null);
      }
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(
        u
          ? {
              uid: u.uid,
              name: u.displayName ?? u.email?.split("@")[0] ?? "مستخدم",
              email: u.email ?? "",
              createdAt: u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : Date.now(),
            }
          : null,
      );
      setLoading(false);
    });
  }, []);

  const demoLogin = (name: string, email: string) => {
    const u: UserProfile = { uid: "demo-" + email.toLowerCase(), name, email, createdAt: Date.now() };
    localStorage.setItem(DEMO_KEY, JSON.stringify(u));
    setUser(u);
  };

  const wrap = async <T,>(fn: () => Promise<T>) => {
    try {
      return await fn();
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? "";
      throw new Error(arabicError(code));
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    if (!firebaseEnabled || !auth) {
      if (!email || password.length < 4) throw new Error("أدخل بريداً وكلمة مرور صحيحة.");
      return demoLogin(email.split("@")[0], email);
    }
    await wrap(() => signInWithEmailAndPassword(auth!, email, password));
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!firebaseEnabled || !auth) {
      if (!name || !email || password.length < 6) throw new Error("أكمل البيانات (كلمة المرور 6 أحرف على الأقل).");
      return demoLogin(name, email);
    }
    await wrap(async () => {
      const cred = await createUserWithEmailAndPassword(auth!, email, password);
      await updateProfile(cred.user, { displayName: name });
      setUser({ uid: cred.user.uid, name, email, createdAt: Date.now() });
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseEnabled || !auth) return demoLogin("مستخدم تجريبي", "demo@shamal.ai");
    await wrap(() => signInWithPopup(auth!, new GoogleAuthProvider()));
  }, []);

  const signOut = useCallback(async () => {
    if (!firebaseEnabled || !auth) {
      localStorage.removeItem(DEMO_KEY);
      setUser(null);
      return;
    }
    await fbSignOut(auth);
  }, []);

  const updateName = useCallback(
    async (name: string) => {
      if (!user) return;
      if (firebaseEnabled && auth?.currentUser) await updateProfile(auth.currentUser, { displayName: name });
      const next = { ...user, name };
      if (!firebaseEnabled) localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      setUser(next);
    },
    [user],
  );

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, demoMode: !firebaseEnabled, signIn, signUp, signInWithGoogle, signOut, updateName }),
    [user, loading, signIn, signUp, signInWithGoogle, signOut, updateName],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth خارج AuthProvider");
  return ctx;
}
