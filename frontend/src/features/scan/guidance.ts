import { HazardCategory } from '@/types';

export interface GuidanceItem {
  category: HazardCategory;
  titleKey: string;
  lookLikeKey: string;
  iconName: string;
  tone: 'danger' | 'warn' | 'brand' | 'info' | 'purple';
  dosKeys: string[];
  dontsKeys: string[];
  isHazard: boolean;
}

export const HAZARD_GUIDANCE: Record<HazardCategory, GuidanceItem> = {
  sharps: {
    category: 'sharps',
    titleKey: 'guidance.sharps.title',
    lookLikeKey: 'guidance.sharps.lookLike',
    iconName: 'Syringe',
    tone: 'danger',
    isHazard: true,
    dosKeys: [
      'guidance.sharps.do1',
      'guidance.sharps.do2',
      'guidance.sharps.do3',
      'guidance.sharps.do4',
    ],
    dontsKeys: [
      'guidance.sharps.dont1',
      'guidance.sharps.dont2',
      'guidance.sharps.dont3',
    ],
  },
  glass: {
    category: 'glass',
    titleKey: 'guidance.glass.title',
    lookLikeKey: 'guidance.glass.lookLike',
    iconName: 'Wine',
    tone: 'warn',
    isHazard: true,
    dosKeys: [
      'guidance.glass.do1',
      'guidance.glass.do2',
      'guidance.glass.do3',
    ],
    dontsKeys: [
      'guidance.glass.dont1',
      'guidance.glass.dont2',
      'guidance.glass.dont3',
    ],
  },
  batteries: {
    category: 'batteries',
    titleKey: 'guidance.batteries.title',
    lookLikeKey: 'guidance.batteries.lookLike',
    iconName: 'BatteryCharging',
    tone: 'warn',
    isHazard: true,
    dosKeys: [
      'guidance.batteries.do1',
      'guidance.batteries.do2',
      'guidance.batteries.do3',
    ],
    dontsKeys: [
      'guidance.batteries.dont1',
      'guidance.batteries.dont2',
      'guidance.batteries.dont3',
    ],
  },
  chemicals: {
    category: 'chemicals',
    titleKey: 'guidance.chemicals.title',
    lookLikeKey: 'guidance.chemicals.lookLike',
    iconName: 'FlaskConical',
    tone: 'danger',
    isHazard: true,
    dosKeys: [
      'guidance.chemicals.do1',
      'guidance.chemicals.do2',
      'guidance.chemicals.do3',
    ],
    dontsKeys: [
      'guidance.chemicals.dont1',
      'guidance.chemicals.dont2',
      'guidance.chemicals.dont3',
    ],
  },
  medical: {
    category: 'medical',
    titleKey: 'guidance.medical.title',
    lookLikeKey: 'guidance.medical.lookLike',
    iconName: 'ShieldAlert',
    tone: 'danger',
    isHazard: true,
    dosKeys: [
      'guidance.medical.do1',
      'guidance.medical.do2',
      'guidance.medical.do3',
    ],
    dontsKeys: [
      'guidance.medical.dont1',
      'guidance.medical.dont2',
      'guidance.medical.dont3',
    ],
  },
  unknown: {
    category: 'unknown',
    titleKey: 'guidance.unknown.title',
    lookLikeKey: 'guidance.unknown.lookLike',
    iconName: 'HelpCircle',
    tone: 'danger',
    isHazard: true,
    dosKeys: [
      'guidance.unknown.do1',
      'guidance.unknown.do2',
      'guidance.unknown.do3',
      'guidance.unknown.do4',
    ],
    dontsKeys: [
      'guidance.unknown.dont1',
      'guidance.unknown.dont2',
      'guidance.unknown.dont3',
    ],
  },
  general: {
    category: 'general',
    titleKey: 'guidance.general.title',
    lookLikeKey: 'guidance.general.lookLike',
    iconName: 'CheckCircle2',
    tone: 'brand',
    isHazard: false,
    dosKeys: [
      'guidance.general.do1',
      'guidance.general.do2',
      'guidance.general.do3',
    ],
    dontsKeys: [
      'guidance.general.dont1',
      'guidance.general.dont2',
    ],
  },
};
