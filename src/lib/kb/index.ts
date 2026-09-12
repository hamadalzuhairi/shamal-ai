import type { Entity, Scenario, Service } from "@/lib/types";
import { ENTITIES } from "./entities";
import { BUSINESS_SERVICES } from "./services.business";
import { INDIVIDUAL_SERVICES } from "./services.individual";
import { SCENARIOS as _SCENARIOS } from "./scenarios";

export const SERVICES: Service[] = [...BUSINESS_SERVICES, ...INDIVIDUAL_SERVICES];
export const SCENARIOS: Scenario[] = _SCENARIOS;
export { ENTITIES };

const serviceMap = new Map(SERVICES.map((s) => [s.id, s]));
const entityMap = new Map(ENTITIES.map((e) => [e.id, e]));
const scenarioMap = new Map(SCENARIOS.map((s) => [s.id, s]));

export const getService = (id: string): Service | undefined => serviceMap.get(id);
export const getEntity = (id: string): Entity | undefined => entityMap.get(id);
export const getScenario = (id: string): Scenario | undefined => scenarioMap.get(id);

export const CATEGORY_LABELS: Record<string, string> = {
  all: "الكل",
  business: "الأعمال",
  civil: "الأحوال",
  passports: "الجوازات",
  traffic: "المرور",
  housing: "الإسكان",
  health: "الصحة",
  social: "الدعم الاجتماعي",
  labor: "الموارد البشرية",
  tax: "الزكاة والضريبة",
};
