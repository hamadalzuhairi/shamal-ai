/** الجهة الحكومية المسؤولة عن الخدمة */
export interface Entity {
  id: string;
  name: string;
  shortName: string;
  url: string;
  channel: string; // اسم المنصة/التطبيق الرسمي
}

export type RequirementKind = "document" | "condition" | "prerequisite";

/** طريقة الحصول على المتطلب عند غيابه — أساس ميزة «لو ما أقدر؟» */
export interface ObtainPath {
  title: string; // مثال: الحصول على عقد إيجار إلكتروني من منصة إيجار
  entityId?: string;
  serviceId?: string; // إن كان المتطلب نفسه خدمة موجودة في قاعدة المعرفة
  url?: string;
  steps: string[];
  durationText?: string;
  why: string; // لماذا هذا المتطلب مطلوب
}

export interface Requirement {
  id: string;
  label: string;
  kind: RequirementKind;
  description?: string;
  obtain?: ObtainPath;
}

export type ServiceCategory =
  | "business"
  | "civil"
  | "passports"
  | "traffic"
  | "housing"
  | "health"
  | "social"
  | "labor"
  | "tax";

export interface Service {
  id: string;
  name: string;
  entityId: string;
  category: ServiceCategory;
  description: string;
  url: string; // رابط القناة الرسمية للخدمة
  requirements: Requirement[];
  prerequisites: string[]; // خدمات يجب إنجازها أولاً (ids)
  steps: string[];
  fees?: string;
  duration?: string;
  sources: string[]; // روابط المصادر الرسمية
  keywords: string[];
  lastVerified?: string; // تاريخ آخر تحقق من المعلومات
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  options?: string[];
  optional?: boolean;
}

/** سيناريو = احتياج شائع يربط عدة خدمات بترتيب معين */
export interface Scenario {
  id: string;
  title: string;
  summary: string; // "الاحتياج: بدء مشروع تجاري"
  intentKeywords: string[];
  questions: ClarifyingQuestion[];
  serviceIds: string[]; // بالترتيب
  audience: "citizen" | "resident" | "business" | "all";
}

export type StepStatus = "done" | "current" | "upcoming" | "blocked";
export type ReqStatus = "done" | "missing" | "unknown";
export type ReadinessLevel = "green" | "yellow" | "red";

export interface JourneyStep {
  serviceId: string;
  order: number;
  status: StepStatus;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
}

export interface Journey {
  id: string;
  userId: string;
  scenarioId: string;
  title: string;
  need: string; // نص الاحتياج الأصلي
  answers: Record<string, string>;
  steps: JourneyStep[];
  reqStatus: Record<string, ReqStatus>;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  favorite?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: "success" | "warning" | "info" | "reminder";
  read: boolean;
  at: number;
  journeyId?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  residency?: "citizen" | "resident";
  language?: "ar";
  createdAt: number;
}

export interface IntentResult {
  scenarioId: string | null;
  confidence: number; // 0..1
  summary: string; // ملخص فهم الاحتياج بلغة المستخدم
  questions: ClarifyingQuestion[];
  source: "llm" | "rules";
}
