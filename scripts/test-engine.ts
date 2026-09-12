/* اختبارات محرك الرحلة وقاعدة المعرفة — تُشغَّل بـ: npx tsx scripts/test-engine.ts */
import assert from "node:assert/strict";
import {
  buildSteps,
  completeCurrentStep,
  computeReadiness,
  createJourney,
  currentStep,
  markBlocked,
  matchScenarioByRules,
  matchServicesByRules,
  nextAction,
  orderServices,
  setRequirementStatus,
  stepRequirements,
} from "../src/lib/engine";
import { ENTITIES, SCENARIOS, SERVICES, getService } from "../src/lib/kb";

let passed = 0;
const failed: string[] = [];
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    failed.push(name);
    console.log(`✗ ${name}\n    ${(e as Error).message}`);
  }
}

/* ---------- قاعدة المعرفة ---------- */
test("كل خدمة لها جهة وروابط ومصادر وتاريخ تحقق", () => {
  for (const s of SERVICES) {
    assert.ok(ENTITIES.some((e) => e.id === s.entityId), `${s.id}: entity`);
    assert.ok(s.url.startsWith("https://"), `${s.id}: url`);
    assert.ok(s.sources.length > 0, `${s.id}: sources`);
    assert.ok(s.lastVerified, `${s.id}: lastVerified`);
    assert.ok(s.steps.length >= 3, `${s.id}: steps`);
    assert.ok(s.requirements.length >= 1, `${s.id}: requirements`);
    assert.ok(s.keywords.length >= 2, `${s.id}: keywords`);
  }
});
test("لا توجد دورات في التبعيات", () => {
  const visit = (id: string, seen: string[]) => {
    assert.ok(!seen.includes(id), `دورة: ${[...seen, id].join(" → ")}`);
    for (const p of getService(id)!.prerequisites) visit(p, [...seen, id]);
  };
  SERVICES.forEach((s) => visit(s.id, []));
});
test("كل مسار «لو ما أقدر؟» يشير إلى خدمة أو رابط موجود", () => {
  for (const s of SERVICES)
    for (const r of s.requirements)
      if (r.obtain) {
        assert.ok(r.obtain.steps.length >= 2, `${s.id}/${r.id}: obtain.steps`);
        assert.ok(r.obtain.why, `${s.id}/${r.id}: obtain.why`);
        if (r.obtain.serviceId) assert.ok(getService(r.obtain.serviceId), `${s.id}/${r.id}: obtain.serviceId`);
      }
});

/* ---------- المطابقة بالقواعد ---------- */
const cases: [string, string][] = [
  ["أبي أبدأ مشروع وما أعرف وش أحتاج", "start-business"],
  ["ابغى افتح محل بقالة في عرعر", "start-business"],
  ["هويتي منتهية وش أسوي؟", "renew-id"],
  ["أبي أطلع هوية لولدي", "first-id"],
  ["أبي أسافر وجوازي منتهي", "passport"],
  ["تجديد الإقامة حقتي", "iqama"],
  ["ابي رخصة قيادة", "driving"],
  ["اشتريت سيارة وأبي أنقل ملكيتها", "vehicle"],
  ["رزقنا بمولود", "newborn"],
  ["أبي أجيب أهلي زيارة", "family-visit"],
  ["أبي أستأجر شقة", "rent-home"],
  ["محتاج دعم الضمان الاجتماعي", "social-support"],
  ["أبي موعد عند دكتور", "health-appointment"],
  ["أبي أسجل علامة تجارية لمشروعي", "protect-brand"],
  ["أبي أشتغل عمل حر", "freelance"],
  ["أبي أوظف عمالة في مؤسستي", "hire-employees"],
  ["بطاقة تسهيلات لذوي الإعاقة", "disability"],
  ["رفع ملف حماية الأجور", "payroll"],
];
for (const [need, expected] of cases)
  test(`مطابقة: «${need}» → ${expected}`, () => {
    const { scenario } = matchScenarioByRules(need);
    assert.equal(scenario?.id, expected);
  });
test("نص غير مفهوم لا يُطابق أي سيناريو", () => {
  assert.equal(matchScenarioByRules("كيف حالك اليوم").scenario, null);
});
test("البحث عن خدمة بالكلمات المفتاحية", () => {
  assert.ok(matchServicesByRules("سجل تجاري").some((s) => s.id === "commercial-register"));
});

/* ---------- بناء الرحلة ---------- */
test("ترتيب الخدمات حسب التبعيات", () => {
  const ordered = orderServices(["balady-license", "commercial-register", "zatca-register"]);
  assert.ok(ordered.indexOf("commercial-register") < ordered.indexOf("balady-license"));
  assert.ok(ordered.indexOf("commercial-register") < ordered.indexOf("zatca-register"));
});
test("الخطوة الأولى «حالية» والباقي «قادمة»", () => {
  const steps = buildSteps(SCENARIOS.find((s) => s.id === "start-business")!.serviceIds);
  assert.equal(steps[0].status, "current");
  assert.ok(steps.slice(1).every((s) => s.status === "upcoming"));
});

/* ---------- الجاهزية والعوائق ---------- */
test("سيناريو المشروع: من عائق عقد الإيجار إلى العودة للرحلة", () => {
  let j = createJourney({ id: "t1", userId: "u", scenarioId: "start-business", need: "أبي أبدأ مشروع" });
  // الخطوة 1: السجل التجاري
  let r = computeReadiness(j);
  assert.equal(r.level, "yellow"); // متطلبات غير محددة
  for (const req of stepRequirements(j, currentStep(j)!)) j = setRequirementStatus(j, req.id, "done");
  r = computeReadiness(j);
  assert.equal(r.level, "green");
  assert.equal(r.percent, 100);
  assert.equal(nextAction(j).kind, "apply");
  // إكمال الخطوة 1 → الخطوة 2 رخصة بلدي
  j = completeCurrentStep(j);
  assert.equal(currentStep(j)!.serviceId, "balady-license");
  // عقد الإيجار ناقص → عائق
  j = setRequirementStatus(j, "bl-lease", "missing");
  r = computeReadiness(j);
  assert.ok(r.missing.some((m) => m.id === "bl-lease"));
  const na = nextAction(j);
  assert.equal(na.kind, "obtain");
  assert.equal(na.requirement?.id, "bl-lease");
  assert.ok(na.url?.includes("ejar.sa"));
  // معالجة العائق → عودة
  j = setRequirementStatus(j, "bl-lease", "done");
  assert.ok(!computeReadiness(j).missing.some((m) => m.id === "bl-lease"));
});
test("خطوة سابقة غير مكتملة → 🔴 لا تبدأ الآن", () => {
  let j = createJourney({ id: "t2", userId: "u", scenarioId: "start-business", need: "x" });
  // نجعل الخطوة 2 حالية دون إكمال الأولى (محاكاة)
  j = { ...j, steps: j.steps.map((s, i) => ({ ...s, status: i === 0 ? "upcoming" : i === 1 ? "current" : "upcoming" })) };
  const r = computeReadiness(j);
  assert.equal(r.level, "red");
  assert.equal(nextAction(j).kind, "obtain");
  assert.equal(nextAction(j).service?.id, "commercial-register");
});
test("markBlocked يبدّل حالة الخطوة الحالية", () => {
  const j = createJourney({ id: "t3", userId: "u", scenarioId: "renew-id", need: "x" });
  assert.equal(markBlocked(j, true).steps[0].status, "blocked");
  assert.equal(markBlocked(markBlocked(j, true), false).steps[0].status, "current");
});
test("إكمال كل الخطوات → الرحلة منتهية", () => {
  let j = createJourney({ id: "t4", userId: "u", scenarioId: "renew-id", need: "x" });
  j = completeCurrentStep(j);
  assert.equal(currentStep(j), undefined);
  assert.equal(nextAction(j).kind, "finished");
  assert.equal(computeReadiness(j).percent, 100);
});
test("كل السيناريوهات تبني رحلة صالحة", () => {
  for (const sc of SCENARIOS) {
    const j = createJourney({ id: sc.id, userId: "u", scenarioId: sc.id, need: sc.title });
    assert.equal(j.steps.length, sc.serviceIds.length, sc.id);
    assert.ok(currentStep(j), sc.id);
    computeReadiness(j);
    nextAction(j);
  }
});

console.log(`\n${passed} نجح، ${failed.length} فشل`);
if (failed.length) process.exit(1);
