# شمال AI — خدماتك الحكومية .. بأسهل طريقة

تطبيق ويب بتصميم جوال (Next.js 16 + TypeScript + Tailwind) يحوّل احتياج المستفيد المكتوب أو المنطوق إلى رحلة إجرائية حكومية: فهم الاحتياج → مطابقة الخدمات → بناء الرحلة → قائمة التحقق → مؤشر الجاهزية → «لو ما أقدر؟» → خطوتك التالية.

مشروع ابتكاري لهاكاثون ENBTHON 2026 — منطقة الحدود الشمالية.

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح http://localhost:3000. بدون ضبط Firebase يعمل التطبيق في **وضع تجريبي** (الحسابات والرحلات تُحفظ محلياً في المتصفح).

## المتغيرات البيئية

انسخ `.env.example` إلى `.env.local` واملأ القيم:

| المتغير | الغرض |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | تسجيل الدخول الحقيقي (بريد/كلمة مرور + Google) وحفظ الرحلات في Firestore |
| `LLM_PROVIDER` | `openai-compatible` أو `anthropic` أو `oracle` أو `none` |
| `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` | لأي نقطة نهاية متوافقة مع OpenAI Chat Completions |
| `ANTHROPIC_API_KEY` | لاستخدام Claude |
| `ORACLE_LLM_URL`, `ORACLE_LLM_KEY`, `ORACLE_LLM_MODEL` | لنموذج Oracle (يُضبط حسب واجهة النموذج) |

عند غياب أي مزود نموذج لغوي، تعمل المطابقة بقواعد الكلمات المفتاحية (مناسبة كخطة بديلة أثناء العرض).

## Firebase (تسجيل الدخول)

1. أنشئ مشروعاً في https://console.firebase.google.com
2. Authentication → Sign-in method → فعّل **Email/Password** و **Google**.
3. Firestore Database → أنشئ قاعدة بيانات (وضع الإنتاج) وأضف القواعد:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /journeys/{id} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid
        || (request.auth != null && resource.data.userId == request.auth.uid);
    }
    match /notifications/{id} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid
        || (request.auth != null && resource.data.userId == request.auth.uid);
    }
  }
}
```

4. Project settings → Your apps → Web app → انسخ القيم إلى `.env.local`.
5. Authentication → Settings → Authorized domains → أضف نطاق Vercel بعد النشر.

## النشر على Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

أو اربط المستودع من لوحة Vercel. أضف متغيرات البيئة نفسها في Project → Settings → Environment Variables.

## بنية المشروع

```
src/app/                 الشاشات (App Router)
  page.tsx               12 الشاشة التمهيدية
  login, register        تسجيل الدخول / إنشاء حساب
  (app)/home             1 الرئيسية — «وش تحتاج؟»
  (app)/understand       2 فهمنا احتياجك
  (app)/journey/[id]     3 رحلتك · /ready 4 جاهز؟ · /blocker 5 لو ما أقدر؟ · /next 6 خطوتك التالية · /chat
  (app)/services         7 قائمة الخدمات · /[id] تفاصيل الخدمة والمصادر
  (app)/chats            8 المحادثات
  (app)/profile          9 حسابي (+ personal, settings, language)
  (app)/notifications    10 الإشعارات
  (app)/help             11 المساعدة والدعم
  api/understand         فهم الاحتياج (نموذج لغوي + قواعد)
  api/assist             مساعد سياقي داخل الرحلة
src/lib/kb/              قاعدة المعرفة (الجهات، الخدمات، السيناريوهات) — موثقة من المصادر الرسمية
src/lib/engine/          محرك الرحلة: الترتيب، الجاهزية، العوائق، الخطوة التالية
src/lib/llm/             طبقة المزودين للنموذج اللغوي
src/lib/firebase/        المصادقة
src/lib/storage.ts       Firestore أو localStorage
src/lib/hooks/useSpeech  الإدخال الصوتي (Web Speech API, ar-SA)
docs/research-*.md       تقارير التحقق من المصادر الحكومية الرسمية مع كل الروابط
scripts/validate-kb.ts   فحص سلامة قاعدة المعرفة
```

## فحص قاعدة المعرفة

```bash
npx tsx scripts/validate-kb.ts
```
