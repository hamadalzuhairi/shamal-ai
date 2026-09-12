/* فحص سلامة قاعدة المعرفة: كل المعرفات المشار إليها موجودة */
import { ENTITIES, SCENARIOS, SERVICES } from "../src/lib/kb";

const svc = new Set(SERVICES.map((s) => s.id));
const ent = new Set(ENTITIES.map((e) => e.id));
const errors: string[] = [];

for (const s of SERVICES) {
  if (!ent.has(s.entityId)) errors.push(`service ${s.id}: entity ${s.entityId} غير موجود`);
  for (const p of s.prerequisites) if (!svc.has(p)) errors.push(`service ${s.id}: prerequisite ${p} غير موجود`);
  for (const r of s.requirements) {
    if (r.obtain?.serviceId && !svc.has(r.obtain.serviceId)) errors.push(`service ${s.id}/${r.id}: obtain.serviceId ${r.obtain.serviceId} غير موجود`);
    if (r.obtain?.entityId && !ent.has(r.obtain.entityId)) errors.push(`service ${s.id}/${r.id}: obtain.entityId ${r.obtain.entityId} غير موجود`);
  }
  if (!s.sources.length) errors.push(`service ${s.id}: بدون مصادر`);
  const ids = s.requirements.map((r) => r.id);
  if (new Set(ids).size !== ids.length) errors.push(`service ${s.id}: معرفات متطلبات مكررة`);
}
const dupSvc = SERVICES.map((s) => s.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupSvc.length) errors.push(`خدمات مكررة: ${dupSvc.join(", ")}`);
for (const sc of SCENARIOS) for (const id of sc.serviceIds) if (!svc.has(id)) errors.push(`scenario ${sc.id}: service ${id} غير موجود`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${SERVICES.length} خدمة، ${SCENARIOS.length} سيناريو، ${ENTITIES.length} جهة`);
