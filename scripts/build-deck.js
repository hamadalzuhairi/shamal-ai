// عرض "التقنية خلف شمال AI" — تقني بالكامل، بهوية التطبيق
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.rtlMode = true;

const C = { bg: "EEF4F4", surface: "FFFFFF", border: "DDE7E7", primary: "1F6A68", dark: "17504E", text: "16302F", muted: "6B7F7E", soft: "E3F0EF", beige: "F4EEE3", green: "E4F0EA", blue: "E4EDF5", lav: "EBE7F4", warnSoft: "FBF3E0", warn: "8A6D3B" };
const FONT = "Arial";
const W = 13.33, H = 7.5;
const logoSlots = [];

const sh = () => ({ type: "outer", color: "17504E", blur: 6, offset: 2, angle: 90, opacity: 0.08 });
function card(s, x, y, w, h, fill = C.surface, border = C.border) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: border, width: 0.75 }, rectRadius: 0.18, shadow: sh() });
}
function T(s, t, x, y, w, h, o = {}) {
  s.addText(t, { x, y, w, h, fontFace: FONT, fontSize: o.size ?? 14, color: o.color ?? C.text, bold: !!o.bold, align: o.align ?? "right", valign: o.valign ?? "top", rtlMode: true, isTextBox: true, margin: o.margin ?? 0, lang: "ar-SA", ...(o.extra ?? {}) });
}
function title(s, t, sub) {
  T(s, t, 0.6, 0.45, W - 1.2, 0.7, { size: 30, bold: true, color: C.dark });
  if (sub) T(s, sub, 0.6, 1.15, W - 1.2, 0.4, { size: 14, color: C.muted });
}
function footer(s, n) {
  T(s, "shamal-ai.vercel.app", 0.6, H - 0.52, 4, 0.3, { size: 10, color: C.muted, align: "left" });
  T(s, `شمال AI · التقنية · ${n}`, W - 5.6, H - 0.52, 5, 0.3, { size: 10, color: C.muted });
}
function tile(s, x, y, size, fill, slideNo, name) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w: size, h: size, fill: { color: fill }, line: { color: fill }, rectRadius: 0.16 });
  logoSlots.push({ slide: slideNo, name, x, y, w: size, h: size });
}
function arrowLeft(s, xRight, y, len) {
  s.addShape(pres.ShapeType.line, { x: xRight - len, y, w: len, h: 0, line: { color: C.primary, width: 2, beginArrowType: "triangle" } });
}
function chip(s, t, x, y, w, h, fill, color) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: h / 2 });
  T(s, t, x, y, w, h, { size: 11, bold: true, color, align: "center", valign: "middle" });
}

/* ===== 1) الغلاف ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.ShapeType.roundRect, { x: 2.9, y: 1.15, w: 7.5, h: 5.2, fill: { color: "FFFFFF", transparency: 10 }, line: { color: "FFFFFF" }, rectRadius: 0.3, shadow: sh() });
  tile(s, 6.03, 1.5, 1.3, "FFFFFF", 1, "شمال AI logo");
  T(s, "التقنية خلف شمال AI", 2.9, 2.95, 7.5, 0.85, { size: 40, bold: true, color: C.dark, align: "center" });
  T(s, "البنية، الأدوات، والمحرك الذي يبني الرحلة", 2.9, 3.8, 7.5, 0.45, { size: 18, color: C.primary, align: "center", bold: true });
  T(s, "تطبيق ويب بتصميم جوال · عربي بالكامل · منشور ويعمل", 2.9, 4.4, 7.5, 0.4, { size: 14, color: C.muted, align: "center" });
  T(s, "ENBTHON 2026 · منطقة الحدود الشمالية", 2.9, 4.85, 7.5, 0.4, { size: 12, color: C.muted, align: "center" });
  chip(s, "shamal-ai.vercel.app", 5.2, 5.5, 2.9, 0.5, C.primary, "FFFFFF");
  s.addNotes("عرض تقني بحت: كيف بُني التطبيق، وبأي أدوات، وما الذي يعمل فعلياً اليوم.");
}

/* ===== 2) المعمارية في صورة واحدة ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "المعمارية في صورة واحدة", "أربع طبقات فقط، كلها داخل مشروع واحد");
  const bw = 2.6, bh = 1.7, gap = 0.55, y = 2.05;
  const x0 = W - 0.64 - bw;
  const boxes = [
    ["المتصفح / الجوال", "واجهة React\nإدخال صوتي بالعربية", C.blue],
    ["Next.js على Vercel", "الصفحات + مسارات API\nتصيير على الخادم", C.green],
    ["محرك الرحلة", "الترتيب والجاهزية\nوالعوائق (داخل التطبيق)", C.lav],
    ["Neon Postgres", "الحسابات والرحلات\nوالإشعارات", C.beige],
  ];
  boxes.forEach((b, i) => {
    const x = x0 - i * (bw + gap);
    card(s, x, y, bw, bh, b[2], b[2]);
    T(s, b[0], x + 0.15, y + 0.25, bw - 0.3, 0.45, { size: 15, bold: true, color: C.dark, align: "center" });
    T(s, b[1], x + 0.15, y + 0.78, bw - 0.3, 0.75, { size: 11, color: C.muted, align: "center", extra: { lineSpacingMultiple: 1.15 } });
    if (i < boxes.length - 1) arrowLeft(s, x, y + bh / 2, gap - 0.06);
  });
  // الطبقة السفلية
  const cw2 = (W - 1.2 - 0.3) / 2, y2 = 4.35, ch2 = 1.6;
  card(s, W - 0.6 - cw2, y2, cw2, ch2, C.surface);
  T(s, "📚 قاعدة المعرفة", W - 0.6 - cw2 + 0.3, y2 + 0.22, cw2 - 0.6, 0.4, { size: 15, bold: true, color: C.dark });
  T(s, "ملفات TypeScript ثابتة: 23 خدمة و17 سيناريو و19 جهة، تُحمَّل مع التطبيق بلا استعلامات خارجية", W - 0.6 - cw2 + 0.3, y2 + 0.68, cw2 - 0.6, 0.8, { size: 12, color: C.muted });
  card(s, 0.6, y2, cw2, ch2, C.warnSoft, "E8D9B5");
  T(s, "🔌 طبقة النموذج اللغوي (اختيارية)", 0.9, y2 + 0.22, cw2 - 0.6, 0.4, { size: 15, bold: true, color: C.warn });
  T(s, "واجهة موحّدة لأربعة مزودات، تُفعَّل بمتغير بيئة واحد. الحالة اليوم: غير مربوطة، والفهم يعمل بالقواعد", 0.9, y2 + 0.68, cw2 - 0.6, 0.8, { size: 12, color: C.muted });
  T(s, "كل شيء في مستودع واحد وتطبيق واحد: لا خوادم منفصلة، ولا خدمات خارجية إلزامية.", 0.6, 6.25, W - 1.2, 0.4, { size: 12, color: C.muted, align: "center" });
  footer(s, 2);
}

/* ===== 3) الواجهة ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "الواجهة", "أدوات مفتوحة المصدر، قياسية، ومدعومة عالمياً");
  const items = [
    ["Next.js 16", "إطار العمل: يبني الصفحات، ويشغّل مسارات الخادم للدخول والبيانات، وينشر على Vercel بأمر واحد", C.blue, "Next.js logo"],
    ["React 19", "بناء الشاشات التفاعلية: قائمة التحقق، مؤشر الجاهزية، خطوات الرحلة", C.green, "React logo"],
    ["TypeScript", "أنواع صارمة لكل خدمة ومتطلب، فتُكتشف الأخطاء وقت الكتابة لا وقت العرض", C.lav, "TypeScript logo"],
    ["Tailwind CSS 4", "نظام تصميم بمتغيرات لون واحدة: الأخضر المزرق والبطاقات الدائرية وواجهة RTL", C.beige, "Tailwind CSS logo"],
  ];
  const cw = (W - 1.2 - 0.3) / 2, ch = 2.25;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.8 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    tile(s, x + cw - 0.3 - 0.85, y + 0.28, 0.85, it[2], 3, it[3]);
    T(s, it[0], x + 0.3, y + 0.35, cw - 1.4, 0.5, { size: 22, bold: true, color: C.dark });
    T(s, it[1], x + 0.3, y + 1.05, cw - 0.6, 1.0, { size: 13, color: C.muted });
  });
  footer(s, 3);
}

/* ===== 4) الخادم والبيانات ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "الخادم والبيانات", "استضافة واحدة، قاعدة بيانات واحدة، ومصادقة مبنية داخل التطبيق");
  const bw = 5.9, bh = 2.2, y = 1.8;
  [["Vercel", "استضافة التطبيق ومسارات الخادم، نشر في أقل من دقيقة، ورابط عام يفتح من أي جهاز", C.blue, "Vercel logo", W - 0.6 - bw],
   ["Neon Postgres", "قاعدة بيانات Postgres بلا خادم، مربوطة من Vercel Storage، والجداول تُنشأ تلقائياً عند أول طلب", C.green, "PostgreSQL logo", 0.6]]
    .forEach((b) => {
      card(s, b[4], y, bw, bh);
      tile(s, b[4] + bw - 0.3 - 0.95, y + 0.3, 0.95, b[2], 4, b[3]);
      T(s, b[0], b[4] + 0.3, y + 0.38, bw - 1.6, 0.5, { size: 22, bold: true, color: C.dark });
      T(s, b[1], b[4] + 0.3, y + 1.05, bw - 0.6, 1.0, { size: 13, color: C.muted });
    });
  const sec = [
    ["bcrypt", "كلمات المرور مُجزّأة ولا تُخزن كنص أبداً"],
    ["JWT + كوكي", "جلسة موقّعة، HttpOnly، صالحة 30 يوماً"],
    ["عزل لكل مستخدم", "كل استعلام مقيّد بمعرّف صاحب الجلسة"],
    ["بلا مستندات", "لا نرفع ولا نخزن أي وثيقة رسمية"],
  ];
  const sw = (W - 1.2 - 0.9) / 4, sy = 4.35, sh2 = 1.75;
  sec.forEach((c, i) => {
    const x = W - 0.6 - sw - i * (sw + 0.3);
    card(s, x, sy, sw, sh2, C.soft, "CFE3E1");
    T(s, c[0], x + 0.22, sy + 0.28, sw - 0.44, 0.45, { size: 16, bold: true, color: C.dark, align: "center" });
    T(s, c[1], x + 0.22, sy + 0.85, sw - 0.44, 0.8, { size: 11, color: C.muted, align: "center" });
  });
  footer(s, 4);
}

/* ===== 5) محرك الرحلة ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "محرك الرحلة", "الجزء الأصلي في المشروع: منطق خالص بلا اعتماد خارجي");
  const steps = [
    ["1", "ترتيب طوبولوجي", "يرتب خدمات السيناريو حسب تبعياتها، فلا تظهر رخصة البلدية قبل السجل التجاري"],
    ["2", "قائمة تحقق مركّبة", "يدمج متطلبات الخدمة مع الخطوات السابقة غير المكتملة في قائمة واحدة"],
    ["3", "مؤشر الجاهزية", "نسبة مئوية وثلاث حالات: أخضر جاهز، أصفر ناقص، أحمر خطوة سابقة لم تكتمل"],
    ["4", "كشف العائق", "أول متطلب ناقص يصبح العائق، ومعه سببه ومساره الرسمي وجهته"],
    ["5", "الخطوة التالية", "إما إكمال متطلب أو التقديم، مع رابط القناة الرسمية والمدة المتوقعة"],
  ];
  const cw = (W - 1.2 - 0.6) / 3, ch = 1.95;
  steps.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.8 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.78, y: y + 0.22, w: 0.5, h: 0.5, fill: { color: C.primary }, line: { color: C.primary } });
    T(s, st[0], x + cw - 0.78, y + 0.22, 0.5, 0.5, { size: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
    T(s, st[1], x + 0.25, y + 0.8, cw - 0.5, 0.4, { size: 16, bold: true, color: C.dark });
    T(s, st[2], x + 0.25, y + 1.25, cw - 0.5, 0.6, { size: 11, color: C.muted });
  });
  const x = W - 0.6 - cw - 2 * (cw + 0.3), y = 1.8 + (ch + 0.3);
  card(s, x, y, cw, ch, C.soft, "CFE3E1");
  T(s, "✅ مغطّى باختبارات", x + 0.25, y + 0.3, cw - 0.5, 0.4, { size: 16, bold: true, color: C.dark });
  T(s, "30 اختباراً آلياً تشمل سلامة القاعدة، ومطابقة 18 عبارة باللهجة، ومسار العائق كاملاً حتى العودة للرحلة", x + 0.25, y + 0.8, cw - 0.5, 1.0, { size: 11, color: C.muted });
  footer(s, 5);
}

/* ===== 6) فهم اللغة والصوت ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "فهم اللغة والصوت", "ما يعمل اليوم، وما هو مُجهَّز للربط");
  // يعمل الآن
  const cw = (W - 1.2 - 0.3) / 2;
  card(s, W - 0.6 - cw, 1.8, cw, 2.35, C.green, "CFE3E1");
  chip(s, "يعمل اليوم", W - 0.6 - cw + cw - 1.5 - 0.3, 2.0, 1.5, 0.38, C.primary, "FFFFFF");
  T(s, "محرك مطابقة عربي", W - 0.6 - cw + 0.3, 2.05, cw - 2.1, 0.45, { size: 19, bold: true, color: C.dark });
  T(s, "يوزّن الكلمات المفتاحية بطولها، فيتفوق «علامة تجارية» على «مشروع». يطبّع الهمزات والتاء المربوطة، ويغطي 17 سيناريو باللهجة السعودية.", W - 0.6 - cw + 0.3, 2.6, cw - 0.6, 1.2, { size: 13, color: C.muted });
  // مجهّز
  card(s, 0.6, 1.8, cw, 2.35, C.warnSoft, "E8D9B5");
  chip(s, "مُجهَّز، غير مربوط", 0.6 + cw - 2.0 - 0.3, 2.0, 2.0, 0.38, C.warn, "FFFFFF");
  T(s, "طبقة النموذج اللغوي", 0.9, 2.05, cw - 2.6, 0.45, { size: 19, bold: true, color: C.dark });
  T(s, "واجهة واحدة تدعم: Oracle، وAnthropic، وأي نقطة نهاية متوافقة مع OpenAI. تُفعَّل بمتغير بيئة واحد، وعند تعطلها يرجع الفهم للقواعد تلقائياً.", 0.9, 2.6, cw - 0.6, 1.2, { size: 13, color: C.muted });
  // الصوت
  card(s, 0.6, 4.4, W - 1.2, 1.55);
  T(s, "🎤 الإدخال الصوتي", 0.9, 4.62, 3.2, 0.45, { size: 19, bold: true, color: C.dark });
  T(s, "Web Speech API داخل المتصفح بلغة ar-SA: يحوّل الكلام العربي إلى نص فوراً، بلا خدمة خارجية وبلا تكلفة. يعمل في Chrome وEdge، ومع رفض الإذن تظهر رسالة عربية واضحة بدل الفشل الصامت.", 0.9, 5.12, W - 1.8, 0.7, { size: 13, color: C.muted });
  T(s, "المبدأ: لا شيء في العرض يعتمد على اتصال خارجي قد ينقطع أمام اللجنة.", 0.6, 6.2, W - 1.2, 0.4, { size: 12, bold: true, color: C.primary, align: "center" });
  footer(s, 6);
}

/* ===== 7) قاعدة المعرفة كبنية بيانات ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "قاعدة المعرفة كبنية بيانات", "الخدمات الحكومية مكتوبة كأنواع TypeScript، لا كنصوص حرة");
  const stats = [["23", "خدمة"], ["17", "سيناريو"], ["19", "جهة"], ["30", "اختباراً"]];
  const sw = 1.85;
  stats.forEach((st, i) => {
    const x = W - 0.6 - sw - i * (sw + 0.25);
    card(s, x, 1.8, sw, 1.5);
    T(s, st[0], x, 1.92, sw, 0.75, { size: 40, bold: true, color: C.primary, align: "center" });
    T(s, st[1], x, 2.72, sw, 0.35, { size: 12, color: C.muted, align: "center" });
  });
  const bx = 0.6, bw = W - 1.2 - 4 * sw - 3 * 0.25 - 0.3;
  card(s, bx, 1.8, bw, 1.5, C.soft, "CFE3E1");
  T(s, "Service · Requirement · Scenario", bx + 0.25, 2.0, bw - 0.5, 0.4, { size: 15, bold: true, color: C.dark, align: "center" });
  T(s, "ثلاثة أنواع تحكم كل شيء", bx + 0.25, 2.5, bw - 0.5, 0.4, { size: 12, color: C.muted, align: "center" });
  const rows = [
    ["كل خدمة كائن مكتمل", "الشروط والمستندات والخطوات والرسوم والمدة والجهة ورابط القناة الرسمية وقائمة المصادر وتاريخ التحقق"],
    ["كل متطلب يحمل مسار حله", "حقل obtain: لماذا هو مطلوب، وأين يُستخرج، وبأي خطوات، وكم يستغرق. هذا ما يغذي شاشة «لو ما أقدر؟»"],
    ["التبعيات صريحة", "prerequisites تربط الخدمات ببعضها، ومنها يُبنى ترتيب الرحلة آلياً بلا كتابة يدوية"],
    ["فحص سلامة آلي", "سكربت يتأكد أن كل معرّف وجهة ومصدر موجود، وأنه لا توجد دورات في التبعيات، قبل كل نشر"],
  ];
  const rh = 0.72, ry = 3.55;
  rows.forEach((r, i) => {
    const y = ry + i * (rh + 0.14);
    card(s, 0.6, y, W - 1.2, rh);
    T(s, r[0], W - 0.6 - 3.3, y + 0.16, 3.0, 0.4, { size: 13, bold: true, color: C.dark });
    T(s, r[1], 0.85, y + 0.16, W - 1.2 - 3.6, 0.45, { size: 11.5, color: C.muted, align: "left" });
  });
  footer(s, 7);
}

/* ===== 8) الأدوات والجودة ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "الأدوات والجودة", "ما استخدمناه حول الكود نفسه");
  const items = [
    ["Git · GitHub", "تتبع كل تعديل، والنشر من سطر أوامر واحد", C.soft, "GitHub logo"],
    ["Pexels", "صور الجبال الصحراوية برخصة استخدام حر", C.green, "Pexels logo"],
    ["Lucide", "أيقونة مميزة لكل خدمة من مكتبة مفتوحة المصدر", C.blue, null],
    ["IBM Plex Sans Arabic", "خط عربي من Google Fonts مقروء على الجوال", C.lav, null],
    ["شعار SVG متجهي", "أُعيد رسم الشعار كمتجه بجودة غير محدودة", C.beige, "شمال AI logo"],
    ["npm test", "اختبارات المحرك وفحص القاعدة قبل كل نشر", C.soft, null],
  ];
  const cw = (W - 1.2 - 0.6) / 3, ch = 2.15;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.8 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    if (it[3]) tile(s, x + cw - 0.28 - 0.85, y + 0.28, 0.85, it[2], 8, it[3]);
    else s.addShape(pres.ShapeType.roundRect, { x: x + cw - 0.28 - 0.85, y: y + 0.28, w: 0.85, h: 0.85, fill: { color: it[2] }, line: { color: it[2] }, rectRadius: 0.16 });
    T(s, it[0], x + 0.28, y + 1.25, cw - 0.56, 0.42, { size: 16, bold: true, color: C.dark });
    T(s, it[1], x + 0.28, y + 1.68, cw - 0.56, 0.42, { size: 11, color: C.muted });
  });
  footer(s, 8);
}

/* ===== 9) لماذا هذه التقنيات ===== */
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  title(s, "لماذا هذه التقنيات؟", "قرارات هندسية لهاكاثون قصير ومنتج قابل للتوسع");
  const items = [
    ["⚡ سرعة", "من الفكرة إلى رابط حي في أيام، ونشر التحديث في أقل من دقيقة"],
    ["💸 تكلفة صفر", "كل الأدوات مجانية أو ضمن خطط مجانية، بلا بطاقة ولا اشتراك"],
    ["📈 توسع بملف واحد", "إضافة خدمة حكومية جديدة = كائن بيانات، بلا تعديل على المحرك أو الواجهة"],
    ["🔐 أمان بالأساس", "تجزئة كلمات المرور، جلسات موقّعة، وعزل بيانات كل مستخدم في كل استعلام"],
    ["🛟 يعمل بلا إنترنت خارجي", "لا اعتماد إلزامي على أي خدمة ذكاء اصطناعي أثناء العرض"],
  ];
  const cw = (W - 1.2 - 0.3) / 2, ch = 1.3;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = W - 0.6 - cw - col * (cw + 0.3), y = 1.75 + row * (ch + 0.22);
    card(s, x, y, cw, ch);
    T(s, it[0], x + 0.3, y + 0.22, cw - 0.6, 0.45, { size: 16, bold: true, color: C.dark });
    T(s, it[1], x + 0.3, y + 0.72, cw - 0.6, 0.5, { size: 12, color: C.muted });
  });
  const x = 0.6, y = 1.75 + 2 * (ch + 0.22);
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: ch, fill: { color: C.primary }, line: { color: C.primary }, rectRadius: 0.18 });
  T(s, "شمال AI: من احتياجك .. إلى خطوتك التالية", x + 0.3, y + 0.25, cw - 0.6, 0.5, { size: 17, bold: true, color: "FFFFFF" });
  T(s, "shamal-ai.vercel.app", x + 0.3, y + 0.75, cw - 0.6, 0.4, { size: 13, color: "FFFFFF", align: "left" });
  footer(s, 9);
}

pres.writeFile({ fileName: "shamal-tech-only.pptx" }).then(() => {
  require("fs").writeFileSync("logo-slots-tech.json", JSON.stringify(logoSlots, null, 2));
  const k = 1920 / 13.33;
  console.log("slots:");
  for (const o of logoSlots) console.log(` slide ${o.slide} ${o.name} → left ${Math.round(o.x * k)} top ${Math.round(o.y * k)} size ${Math.round(o.w * k)}`);
});
