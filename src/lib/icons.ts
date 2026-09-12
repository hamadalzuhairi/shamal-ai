import {
  Accessibility,
  Baby,
  BadgeCheck,
  BookUser,
  Briefcase,
  Car,
  CarFront,
  ClipboardCheck,
  FileSignature,
  FileText,
  HandCoins,
  Headset,
  House,
  IdCard,
  Laptop,
  MapPin,
  Receipt,
  ScrollText,
  ShieldCheck,
  Stamp,
  Stethoscope,
  UserSquare,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** أيقونة مميزة لكل خدمة (بأسلوب الأيقونات المخططة في التصميم) */
const BY_ID: Record<string, LucideIcon> = {
  "commercial-register": ScrollText,
  "balady-license": BadgeCheck,
  "ejar-commercial": FileSignature,
  "final-permit": ClipboardCheck,
  "zatca-register": Receipt,
  "gosi-register": ShieldCheck,
  "qiwa-establishment": Briefcase,
  "mudad-wps": Wallet,
  "freelance-license": Laptop,
  trademark: Stamp,
  "national-id-issue": IdCard,
  "national-id-renew": IdCard,
  "passport-issue": BookUser,
  "iqama-renew": UserSquare,
  "driving-license": Car,
  "vehicle-registration": CarFront,
  "birth-registration": Baby,
  "family-visit-visa": Users,
  "ejar-residential": House,
  "national-address": MapPin,
  "sehhaty-appointment": Stethoscope,
  "social-security": HandCoins,
  "disability-card": Accessibility,
};

export function serviceIcon(serviceId: string): LucideIcon {
  return BY_ID[serviceId] ?? FileText;
}

export const SupportIcon = Headset;
