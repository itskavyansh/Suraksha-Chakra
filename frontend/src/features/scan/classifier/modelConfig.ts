import { HazardCategory } from '@/types';

export const CLIP_MODEL_ID = 'Xenova/clip-vit-base-patch32';

export interface PromptDefinition {
  label: string;
  category: HazardCategory;
  prompt: string;
}

export const CANONICAL_PROMPTS: PromptDefinition[] = [
  // Sharps
  { label: 'Syringe / Medical Needle', category: 'sharps', prompt: 'a medical syringe with a sharp needle' },
  { label: 'Razor Blade / Box Cutter', category: 'sharps', prompt: 'a sharp razor blade or knife' },
  { label: 'Sharp Iron Nail', category: 'sharps', prompt: 'a rusty sharp pointed construction nail' },

  // Glass
  { label: 'Broken Glass Shards', category: 'glass', prompt: 'jagged dangerous broken glass shards' },
  { label: 'Shattered Glass Bottle', category: 'glass', prompt: 'a cracked shattered glass beverage bottle' },

  // Batteries
  { label: 'Lithium Battery Cell', category: 'batteries', prompt: 'a swollen lithium ion phone battery' },
  { label: 'Alkaline AA Battery', category: 'batteries', prompt: 'an old corroded alkaline battery' },
  { label: 'Lead Acid Car Battery', category: 'batteries', prompt: 'a heavy lead acid vehicle battery' },

  // Chemicals
  { label: 'Chemical Container', category: 'chemicals', prompt: 'a plastic bottle with skull chemical danger warning' },
  { label: 'Acid / Corrosive Fluid', category: 'chemicals', prompt: 'a jug of corrosive acid chemical solvent' },
  { label: 'Pesticide Can', category: 'chemicals', prompt: 'a canister of agricultural poison or pesticide' },

  // Medical
  { label: 'Blood Stained Bandage', category: 'medical', prompt: 'a bloody used medical bandage dressing' },
  { label: 'Biohazard Waste Bag', category: 'medical', prompt: 'a yellow hazardous hospital clinical waste bag' },

  // General Scrap (Safe)
  { label: 'Cardboard Box', category: 'general', prompt: 'a clean dry corrugated cardboard packing box' },
  { label: 'PET Beverage Bottle', category: 'general', prompt: 'an empty clear plastic soft drink bottle' },
  { label: 'Aluminum Scrap Can', category: 'general', prompt: 'an empty crushed aluminum soda can' },
  { label: 'Old Newspaper / Paper', category: 'general', prompt: 'a bundle of recyclable waste paper and newsprint' },

  // Ambiguous
  { label: 'Unidentified Object', category: 'unknown', prompt: 'an ambiguous unidentifiable dirty scrap object' },
];

export const HAZARD_CATEGORIES: HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
];
