import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Zap,
  Droplets,
  Plus,
  Leaf,
  HelpCircle,
  Scissors,
} from 'lucide-react';
import type { HazardCategory } from '../../types';

export interface GuidanceEntry {
  icon: LucideIcon;
  tone: 'danger' | 'warn' | 'safe';
  dos: string[];   // i18n keys
  donts: string[]; // i18n keys
}

export const GUIDANCE: Record<HazardCategory, GuidanceEntry> = {
  sharps: {
    icon: AlertTriangle,
    tone: 'danger',
    dos: [
      'scan.guidance.sharps.do1',
      'scan.guidance.sharps.do2',
      'scan.guidance.sharps.do3',
    ],
    donts: [
      'scan.guidance.sharps.dont1',
      'scan.guidance.sharps.dont2',
      'scan.guidance.sharps.dont3',
    ],
  },
  glass: {
    icon: Scissors,
    tone: 'danger',
    dos: [
      'scan.guidance.glass.do1',
      'scan.guidance.glass.do2',
      'scan.guidance.glass.do3',
    ],
    donts: [
      'scan.guidance.glass.dont1',
      'scan.guidance.glass.dont2',
    ],
  },
  batteries: {
    icon: Zap,
    tone: 'warn',
    dos: [
      'scan.guidance.batteries.do1',
      'scan.guidance.batteries.do2',
      'scan.guidance.batteries.do3',
    ],
    donts: [
      'scan.guidance.batteries.dont1',
      'scan.guidance.batteries.dont2',
    ],
  },
  chemicals: {
    icon: Droplets,
    tone: 'danger',
    dos: [
      'scan.guidance.chemicals.do1',
      'scan.guidance.chemicals.do2',
      'scan.guidance.chemicals.do3',
    ],
    donts: [
      'scan.guidance.chemicals.dont1',
      'scan.guidance.chemicals.dont2',
      'scan.guidance.chemicals.dont3',
    ],
  },
  medical: {
    icon: Plus,
    tone: 'danger',
    dos: [
      'scan.guidance.medical.do1',
      'scan.guidance.medical.do2',
    ],
    donts: [
      'scan.guidance.medical.dont1',
      'scan.guidance.medical.dont2',
      'scan.guidance.medical.dont3',
    ],
  },
  general: {
    icon: Leaf,
    tone: 'safe',
    dos: [
      'scan.guidance.general.do1',
      'scan.guidance.general.do2',
      'scan.guidance.general.do3',
    ],
    donts: [
      'scan.guidance.general.dont1',
    ],
  },
  unknown: {
    icon: HelpCircle,
    tone: 'danger',
    dos: [
      'scan.guidance.unknown.do1',
      'scan.guidance.unknown.do2',
      'scan.guidance.unknown.do3',
    ],
    donts: [
      'scan.guidance.unknown.dont1',
      'scan.guidance.unknown.dont2',
      'scan.guidance.unknown.dont3',
    ],
  },
};
