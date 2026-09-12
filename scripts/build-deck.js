// بناء عرض "شمال AI — التقنية والمصادر" بهوية التطبيق
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
pres.rtlMode = true;

const C = { bg: "EEF4F4", surface: "FFFFFF", border: "DDE7E7", primary: "1F6A68", dark: "17504E", text: "16302F", muted: "6B7F7E", soft: "E3F0EF", beige: "F4EEE3", green: "E4F0EA", blue: "E4EDF5", lav: "EBE7F4", ok: "2E8A5B", warn: "D59A1C", danger: "C94A4A" };
const FONT = "Arial";
const W = 13.33, H = 7.5;
const logoSlots = []; // {slide, name, x, y, w, h} in inches → لإدراج الشعارات من Canva لاحقاً

function shadow() { return { type: "outer", color: "17504E", blur: 6, offset: 2, angle: 90, opacity: 0.08 }; }
function card(slide, x, y, w, h, fill = C.surface) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: C.border, width: 0.75 }, rectRadius: 0.18, shadow: shadow() });
}
function text(slide, t, x, y, w, h, o = {}) {
  slide.addText(t, { x, y, w, h, fontFace: FONT, fontSize: o.size ?? 14, color: o.color ?? C.text, bold: !!o.bold, align: o.align ?? "right", valign: o.valign ?? "top", rtlMode: true, isTextBox: true, margin: o.margin ?? 0, lang: "ar-SA", ...(o.extra ?? {}) });
}
function title(slide, t, sub) {
  text(slide, t, 0.6, 0.45, W - 1.2, 0.7, { size: 30, bold: true, color: C.dark });
  if (sub) text(slide, sub, 0.6, 1.15, W - 1.2, 0.4, { size: 14, color: C.muted });
}
function footer(slide, n) {
  text(slide, "shamal-ai.vercel.app", 0.6, H - 0.55, 4, 0.3, { size: 10, color: C.muted, align: "left" });
  text(slide, `شمال AI · ENBTHON 2026 · ${n}`, W - 5.6, H - 0.55, 5, 0.3, { size: 10, color: C.muted });
}
function tile(slide, x, y, s, fill, slideNo, name) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w: s, h: s, fill: { color: fill }, line: { color: fill }, rectRadius: 0.16 });
  logoSlots.push({ slide: slideNo, name, x, y, w: s, h: s });
}
function pill(slide, t, x, y, w, h, fill, color) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.25 });
  text(slide, t, x, y, w, h, { size: 12, bold: true, color, align: "center", valign: "middle" });
}

/* ---------- 1) الغلاف ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  // بطاقة مركزية شبه شفافة (الخلفية الفوتوغرافية تُضاف في Canva)
  s.addShape(pres.ShapeType.roundRect, { x: 2.9, y: 1.1, w: 7.5, h: 5.3, fill: { color: "FFFFFF", transparency: 12 }, line: { color: "FFFFFF" }, rectRadius: 0.3, shadow: shadow() });
  tile(s, 6.0, 1.45, 1.35, "FFFFFF", 1, "شمال AI logo");
  text(s, "شمال AI", 2.9, 2.9, 7.5, 0.9, { size: 44, bold: true, color: C.dark, align: "center" });
  text(s, "خدماتك الحكومية .. بأسهل طريقة", 2.9, 3.75, 7.5, 0.4, { size: 16, color: C.muted, align: "center" });
  text(s, "التقنية خلف التطبيق: كيف بنيناه وبأي أدوات ومصادر", 2.9, 4.45, 7.5, 0.5, { size: 20, bold: true, color: C.primary, align: "center" });
  text(s, "ENBTHON 2026 · منطقة الحدود الشمالية", 2.9, 5.05, 7.5, 0.4, { size: 13, color: C.muted, align: "center" });
  pill(s, "shamal-ai.vercel.app", 5.2, 5.6, 2.9, 0.45, C.primary, "FFFFFF");
  s.addNotes("شريحة الغلاف: التطبيق منشور ويعمل على الرابط، نعرض اليوم التقنيات المستخدمة بلغة مبسطة.");
}

/* ---------- 2) كيف يعمل التطبيق في 6 خطوات ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "كيف يعمل التطبيق في 6 خطوات", "من احتياج المستفيد إلى خطوته التالية");
  const steps = [
    ["المستفيد يكتب أو يقول احتياجه بلغته", "«أبي أبدأ مشروع وما أعرف وش أحتاج»"],
    ["التطبيق يفهم القصد ويسأل أسئلة قصيرة", "نوع النشاط؟ المدينة؟ شركاء؟"],
    ["يطابق الاحتياج مع الخدمات الرسمية ويبني رحلة مرتبة", "سجل تجاري ← رخصة بلدي ← تراخيص ← ضريبة"],
    ["يفحص المتطلبات ويحسب مؤشر الجاهزية", "🟢 جاهز · 🟡 يحتاج إكمال · 🔴 لا تبدأ الآن"],
    ["عند وجود عائق: ميزة «لو ما أقدر؟»", "تشرح السبب وتعرض المسار الرسمي للحل"],
    ["يحدد خطوتك التالية", "زر ينقلك مباشرة للقناة الرسمية"],
  ];
  const cw = 3.85, ch = 2.15, gx = 0.35, gy = 0.35, x0 = W - 0.6 - cw, y0 = 1.8;
  steps.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = x0 - col * (cw + gx), y = y0 + row * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.75, y: y + 0.25, w: 0.5, h: 0.5, fill: { color: C.primary }, line: { color: C.primary } });
    text(s, String(i + 1), x + cw - 0.75, y + 0.25, 0.5, 0.5, { size: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
    text(s, st[0], x + 0.25, y + 0.9, cw - 0.5, 0.7, { size: 14, bold: true, color: C.dark });
    text(s, st[1], x + 0.25, y + 1.55, cw - 0.5, 0.45, { size: 11, color: C.muted });
  });
  footer(s, 2);
  s.addNotes("نشرح التدفق كاملاً بمثال بدء مشروع.");
}

/* ---------- 3) واجهة التطبيق ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "واجهة التطبيق (ما يراه المستخدم)", "أدوات مفتوحة المصدر ومشهورة عالمياً");
  const rows = [
    ["Next.js", "إطار العمل الذي يبني صفحات التطبيق ويجعلها سريعة، ويشغّل خدمات الخادم (تسجيل الدخول والبيانات)", C.blue, "Next.js logo"],
    ["React", "مكتبة بناء الشاشات التفاعلية: قائمة التحقق، الأزرار، مؤشر الجاهزية", C.green, "React logo"],
    ["TypeScript", "لغة برمجة تكتشف الأخطاء قبل وصولها للمستخدم", C.lav, "TypeScript logo"],
    ["Tailwind CSS", "أداة التصميم التي أعطت التطبيق ألوانه وبطاقاته الدائرية", C.beige, "Tailwind CSS logo"],
  ];
  const rh = 1.1, gap = 0.22, y0 = 1.8, x = 0.6, w = W - 1.2;
  rows.forEach((r, i) => {
    const y = y0 + i * (rh + gap);
    card(s, x, y, w, rh);
    tile(s, x + w - 0.2 - 0.8, y + 0.15, 0.8, r[2], 3, r[3]);
    text(s, r[0], x + 0.3, y + 0.18, w - 1.4, 0.4, { size: 18, bold: true, color: C.dark, extra: { fontFace: "Arial" } });
    text(s, r[1], x + 0.3, y + 0.58, w - 1.4, 0.45, { size: 13, color: C.muted });
  });
  pill(s, "تصميم جوال أولاً: يعمل على أي هاتف أو متصفح بدون تحميل تطبيق", 0.6, 7.5 - 0.55 - 0.55, W - 1.2, 0.45, C.soft, C.dark);
  footer(s, 3);
}

/* ---------- 4) الاستضافة والبيانات ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "الاستضافة والبيانات", "أين يعيش التطبيق وكيف نحمي بيانات المستخدم");
  // بطاقتان كبيرتان
  const bw = 5.9, bh = 2.3, y = 1.8;
  const big = [
    ["Vercel", "يستضيف التطبيق على الإنترنت ويعطينا رابطاً عاماً يفتح من أي جهاز، وينشر التحديثات خلال دقيقة", C.blue, "Vercel logo", W - 0.6 - bw],
    ["Neon Postgres", "قاعدة البيانات التي تحفظ الحسابات والرحلات والإشعارات، ومرتبطة مباشرة بـ Vercel", C.green, "PostgreSQL logo", 0.6],
  ];
  big.forEach((b) => {
    card(s, b[4], y, bw, bh);
    tile(s, b[4] + bw - 0.3 - 1.0, y + 0.3, 1.0, b[2], 4, b[3]);
    text(s, b[0], b[4] + 0.3, y + 0.35, bw - 1.8, 0.5, { size: 22, bold: true, color: C.dark });
    text(s, b[1], b[4] + 0.3, y + 1.0, bw - 0.6, 1.1, { size: 13, color: C.muted });
  });
  const sec = [
    ["🔒 كلمات المرور مشفرة", "بخوارزمية bcrypt ولا تُخزن كنص أبداً"],
    ["🪪 جلسة دخول موقّعة", "رمز JWT صالح 30 يوماً داخل كوكي آمن"],
    ["🗂️ لا نخزن مستنداتك", "فقط حالة رحلتك والمتطلبات التي تحددها بنفسك"],
  ];
  const sw = (W - 1.2 - 0.6) / 3, sy = 4.45, sh = 1.7;
  sec.forEach((c, i) => {
    const x = W - 0.6 - sw - i * (sw + 0.3);
    card(s, x, sy, sw, sh, C.soft);
    text(s, c[0], x + 0.25, sy + 0.25, sw - 0.5, 0.5, { size: 15, bold: true, color: C.dark });
    text(s, c[1], x + 0.25, sy + 0.8, sw - 0.5, 0.8, { size: 12, color: C.muted });
  });
  footer(s, 4);
}

/* ---------- 5) الذكاء في التطبيق ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "الذكاء في التطبيق", "محرك رحلة، وليس مجرد شات بوت");
  const items = [
    ["🧭 محرك الرحلة", "يرتب الخدمات حسب تبعياتها، يحسب مؤشر الجاهزية، ويكتشف العوائق ويقترح مسارها الرسمي"],
    ["💬 فهم اللغة", "مطابقة باللهجة السعودية بالكلمات المفتاحية، مع ربط نموذج لغوي مستضاف على Oracle لفهم أدق"],
    ["🛟 خطة بديلة", "الفهم بالقواعد يعمل حتى لو انقطع الاتصال بالنموذج، فلا يتوقف العرض"],
    ["🎤 الإدخال الصوتي", "تقنية Web Speech في المتصفح تحوّل الكلام العربي إلى نص فوراً"],
    ["📚 مساعد سياقي", "يجيب داخل الرحلة من قاعدة المعرفة الرسمية فقط، ولا يقترح تجاوز الأنظمة"],
  ];
  const cw = (W - 1.2 - 0.3) / 2, ch = 1.45, gx = 0.3, gy = 0.25;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = W - 0.6 - cw - col * (cw + gx), y = 1.8 + row * (ch + gy);
    card(s, x, y, cw, ch);
    text(s, it[0], x + 0.3, y + 0.22, cw - 0.6, 0.45, { size: 16, bold: true, color: C.dark });
    text(s, it[1], x + 0.3, y + 0.7, cw - 0.6, 0.7, { size: 12, color: C.muted });
  });
  pill(s, "ORACLE", 0.6 + 0.3, 1.8 + 2 * (ch + gy) + 0.45, 1.6, 0.5, C.soft, C.primary);
  text(s, "نموذج لغوي مستضاف لدى Oracle", 0.6 + 2.1, 1.8 + 2 * (ch + gy) + 0.5, cw - 2.4, 0.4, { size: 12, color: C.muted, align: "left" });
  footer(s, 5);
}

/* ---------- 6) قاعدة المعرفة الحكومية ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "قاعدة المعرفة الحكومية", "كل معلومة في التطبيق موثقة من مصدرها الرسمي");
  const stats = [["23", "خدمة حكومية"], ["17", "سيناريو احتياج"], ["19", "جهة رسمية"]];
  const sw = 2.6, sh = 1.7;
  stats.forEach((st, i) => {
    const x = W - 0.6 - sw - i * (sw + 0.3);
    card(s, x, 1.8, sw, sh);
    text(s, st[0], x, 1.95, sw, 0.9, { size: 48, bold: true, color: C.primary, align: "center" });
    text(s, st[1], x, 2.9, sw, 0.4, { size: 13, color: C.muted, align: "center" });
  });
  const bullets = [
    "كل خدمة تحمل: الشروط، المستندات، الخطوات، الرسوم، المدة، ورابط القناة الرسمية",
    "تم التحقق من كل معلومة من الصفحة الرسمية بتاريخ 12 سبتمبر 2026",
    "كل معلومة غير مؤكدة حُذفت أو وُسمت بوضوح",
    "تُعرض روابط المصادر داخل التطبيق في صفحة كل خدمة",
  ];
  card(s, 0.6, 1.8, W - 1.2 - 3 * (sw + 0.3), 4.6, C.surface);
  text(s, bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1, paraSpaceAfter: 10 } })), 0.85, 2.05, W - 1.2 - 3 * (sw + 0.3) - 0.5, 4.2, { size: 14, color: C.text });
  card(s, W - 0.6 - 3 * (sw + 0.3) + 0.3, 3.8, 3 * sw + 0.6, 2.6, C.soft);
  text(s, "مثال: رخصة بلدي تحتاج عقد إيجار موثق ← التطبيق يعرف ذلك من صفحة بلدي الرسمية، فيوجّه المستخدم إلى منصة إيجار قبل التقديم.", W - 0.6 - 3 * (sw + 0.3) + 0.6, 4.05, 3 * sw + 0.0, 2.1, { size: 14, color: C.dark });
  footer(s, 6);
}

/* ---------- 7) المصادر الرسمية ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "المصادر الرسمية التي اعتمدنا عليها", "جهات حكومية سعودية فقط، لا مصادر غير رسمية");
  const src = [
    ["المنصة الوطنية الموحدة", "my.gov.sa"], ["أبشر", "الأحوال المدنية · الجوازات · المرور"],
    ["المركز السعودي للأعمال", "وزارة التجارة · السجل التجاري"], ["منصة بلدي", "رخص الأنشطة التجارية"],
    ["منصة إيجار", "العقود السكنية والتجارية"], ["هيئة الزكاة والضريبة والجمارك", "الزكاة وضريبة القيمة المضافة"],
    ["التأمينات الاجتماعية", "تسجيل المنشآت والمشتركين"], ["قوى · مدد", "العمالة وحماية الأجور"],
    ["الهيئة السعودية للملكية الفكرية", "العلامات التجارية"], ["منصة العمل الحر · منشآت", "وثيقة العمل الحر ودعم المنشآت"],
    ["وزارة الخارجية", "منصة التأشيرات"], ["سبل", "العنوان الوطني"],
    ["صحتي", "المواعيد الطبية"], ["وزارة الموارد البشرية", "الضمان الاجتماعي · ذوي الإعاقة"],
  ];
  const cols = 2, cw = (W - 1.2 - 0.3) / 2, ch = 0.62, gy = 0.14;
  src.forEach((it, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.75 + row * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.5, y: y + 0.19, w: 0.24, h: 0.24, fill: { color: C.primary }, line: { color: C.primary } });
    text(s, it[0], x + 2.9, y + 0.12, cw - 3.5, 0.4, { size: 13, bold: true, color: C.dark, valign: "middle" });
    text(s, it[1], x + 0.25, y + 0.12, 2.7, 0.4, { size: 10, color: C.muted, valign: "middle", align: "left" });
  });
  footer(s, 7);
}

/* ---------- 8) موارد التصميم والأدوات ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "موارد التصميم والأدوات", "ما استخدمناه لبناء الشكل والجودة");
  const items = [
    ["Pexels", "صور مجانية لجبال طويق والصحراء السعودية (رخصة استخدام حر)", C.green, "Pexels logo"],
    ["Lucide", "مكتبة أيقونات مفتوحة المصدر لكل خدمة", C.blue, null],
    ["IBM Plex Sans Arabic", "خط عربي من Google Fonts واضح على الجوال", C.lav, null],
    ["شعار متجهي SVG", "أُعيد رسم شعار شمال بجودة غير محدودة", C.beige, "شمال AI logo"],
    ["Git · GitHub", "حفظ الكود وتتبع كل تعديل", C.soft, "GitHub logo"],
    ["اختبارات آلية", "30 اختباراً لمحرك الرحلة وفحص سلامة قاعدة المعرفة", C.green, null],
  ];
  const cw = (W - 1.2 - 0.6) / 3, ch = 2.1;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.8 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    if (it[3]) tile(s, x + cw - 0.25 - 0.8, y + 0.25, 0.8, it[2], 8, it[3]);
    else s.addShape(pres.ShapeType.roundRect, { x: x + cw - 0.25 - 0.8, y: y + 0.25, w: 0.8, h: 0.8, fill: { color: it[2] }, line: { color: it[2] }, rectRadius: 0.16 });
    text(s, it[0], x + 0.25, y + 1.15, cw - 0.5, 0.4, { size: 16, bold: true, color: C.dark });
    text(s, it[1], x + 0.25, y + 1.55, cw - 0.5, 0.5, { size: 11, color: C.muted });
  });
  footer(s, 8);
}

/* ---------- 9) لماذا هذه التقنيات؟ ---------- */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "لماذا هذه التقنيات؟", "قرارات عملية لهاكاثون قصير ومنتج قابل للتوسع");
  const items = [
    ["⚡ سرعة البناء", "من الفكرة إلى رابط حي في أيام"],
    ["💸 تكلفة صفر", "كل الأدوات مجانية أو بخطط مجانية"],
    ["📈 سهولة التوسع", "إضافة خدمة جديدة = ملف بيانات واحد"],
    ["🔐 الأمان", "تشفير كلمات المرور وجلسات موقّعة وبيانات معزولة لكل مستخدم"],
    ["🏛️ القنوات الرسمية", "طبقة ذكية فوق الخدمات القائمة بدل بناء بوابة جديدة"],
  ];
  const cw = (W - 1.2 - 0.3) / 2, ch = 1.25;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.75 + row * (ch + 0.22);
    card(s, x, y, cw, ch);
    text(s, it[0], x + 0.3, y + 0.2, cw - 0.6, 0.45, { size: 16, bold: true, color: C.dark });
    text(s, it[1], x + 0.3, y + 0.68, cw - 0.6, 0.5, { size: 12, color: C.muted });
  });
  // بطاقة الختام
  const x = 0.6, y = 1.75 + 2 * (ch + 0.22);
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: C.primary }, line: { color: C.primary }, rectRadius: 0.18 });
  text(s, "شمال AI: من احتياجك .. إلى خطوتك التالية", x + 0.3, y + 0.2, cw - 0.6, 0.5, { size: 17, bold: true, color: "FFFFFF" });
  text(s, "shamal-ai.vercel.app", x + 0.3, y + 0.72, cw - 0.6, 0.4, { size: 13, color: "FFFFFF", align: "left" });
  footer(s, 9);
}

pres.writeFile({ fileName: "shamal-tech.pptx" }).then(() => {
  require("fs").writeFileSync("logo-slots.json", JSON.stringify(logoSlots, null, 2));
  console.log("written", logoSlots.length, "logo slots");
});
