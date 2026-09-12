# شمال AI — خدماتك الحكومية .. بأسهل طريقة

تطبيق ويب بتصميم جوال (Next.js 16 + TypeScript + Tailwind) يحوّل احتياج المستفيد المكتوب أو المنطوق إلى رحلة إجرائية حكومية: فهم الاحتياج → مطابقة الخدمات → بناء الرحلة → قائمة التحقق → مؤشر الجاهزية → «لو ما أقدر؟» → خطوتك التالية.

مشروع ابتكاري لهاكاثون ENBTHON 2026 — منطقة الحدود الشمالية.

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح http://localhost:3000. بدون ضبط قاعدة البيانات يعمل التطبيق في **وضع تجريبي** (الحسابات والرحلات تُحفظ محلياً في المتصفح).

## المتغيرات البيئية

انسخ `.env.example` إلى `.env.local` واملأ القيم:

| المتغير | الغرض |
|---|---|
| `DATABASE_URL` | Postgres (Neon عبر Vercel Storage) — يُضاف تلقائياً عند ربط قاعدة البيانات بالمشروع في Vercel |
| `AUTH_SECRET` | سر توقيع جلسات الدخول (نص عشوائي طويل) |
| `LLM_PROVIDER` | `openai-compatible` أو `anthropic` أو `oracle` أو `none` |
| `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` | لأي نقطة نهاية متوافقة مع OpenAI Chat Completions |
| `ANTHROPIC_API_KEY` | لاستخدام Claude |
| `ORACLE_LLM_URL`, `ORACLE_LLM_KEY`, `ORACLE_LLM_MODEL` | لنموذج Oracle (يُضبط حسب واجهة النموذج) |

عند غياب أي مزود نموذج لغوي، تعمل المطابقة بقواعد الكلمات المفتاحية (مناسبة كخطة بديلة أثناء العرض).

## المصادقة والبيانات (Vercel)

- تسجيل الدخول بالبريد وكلمة المرور. كلمات المرور مشفرة بـ bcrypt، والجلسة كوكي JWT موقّع بـ `AUTH_SECRET` صالح 30 يوماً.
- الجداول (`users`, `journeys`, `notifications`) تُنشأ تلقائياً عند أول طلب.
- قاعدة البيانات: من لوحة Vercel → المشروع → Storage → Create Database → Neon (Postgres). الربط يضيف `DATABASE_URL` تلقائياً.

## النشر على Vercel

```bash
npx vercel --prod
```

أضف `AUTH_SECRET` في Project → Settings → Environment Variables (أو عبر `npx vercel env add AUTH_SECRET production`).

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
  api/auth/[action]      me · login · register · logout · name
  api/data/[collection]  journeys · notifications
  api/understand         فهم الاحتياج (نموذج لغوي + قواعد)
  api/assist             مساعد سياقي داخل الرحلة
src/lib/kb/              قاعدة المعرفة (الجهات، الخدمات، السيناريوهات) — موثقة من المصادر الرسمية
src/lib/engine/          محرك الرحلة: الترتيب، الجاهزية، العوائق، الخطوة التالية
src/lib/llm/             طبقة المزودين للنموذج اللغوي
src/lib/server/          قاعدة البيانات (Neon) والمصادقة (JWT + bcrypt)
src/lib/auth-context.tsx سياق المصادقة في الواجهة (خادم أو وضع تجريبي)
src/lib/storage.ts       API الخادم أو localStorage
src/lib/hooks/useSpeech  الإدخال الصوتي (Web Speech API, ar-SA)
docs/research-*.md       تقارير التحقق من المصادر الحكومية الرسمية مع كل الروابط
scripts/validate-kb.ts   فحص سلامة قاعدة المعرفة
```

## فحص قاعدة المعرفة

```bash
npx tsx scripts/validate-kb.ts
```
