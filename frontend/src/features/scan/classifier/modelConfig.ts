import type { HazardCategory } from '../../../types';

export interface CategoryPrompt {
  category: HazardCategory;
  prompt: string;
  label: string;
}

export interface PromptScore {
  prompt: string;
  score: number;
}

export const MODEL_ID = 'Xenova/clip-vit-base-patch32';
export const GENERAL_MIN_MASS = 0.70;
export const GENERAL_MAX_HAZARD_MASS = 0.20;
export const MODEL_LOAD_TIMEOUT_MS = 90000;

export const CATEGORY_PROMPTS: readonly CategoryPrompt[] = [
  // sharps (4)
  { category: 'sharps', prompt: 'a photo of a used syringe with a needle', label: 'Needle / Syringe' },
  { category: 'sharps', prompt: 'a photo of a hypodermic needle', label: 'Needle / Syringe' },
  { category: 'sharps', prompt: 'a photo of a razor blade', label: 'Blade / Razor' },
  { category: 'sharps', prompt: 'a photo of a sharp knife blade', label: 'Blade / Razor' },

  // glass (4)
  { category: 'glass', prompt: 'a photo of broken glass shards', label: 'Broken glass' },
  { category: 'glass', prompt: 'a photo of a broken glass bottle', label: 'Broken glass' },
  { category: 'glass', prompt: 'a photo of shattered window glass', label: 'Broken glass' },
  { category: 'glass', prompt: 'a photo of pieces of a broken drinking glass', label: 'Broken glass' },

  // batteries (4)
  { category: 'batteries', prompt: 'a photo of a used battery', label: 'Battery' },
  { category: 'batteries', prompt: 'a photo of a lithium-ion battery cell', label: 'Battery (Li-ion / cell)' },
  { category: 'batteries', prompt: 'a photo of a pile of AA batteries', label: 'Battery' },
  { category: 'batteries', prompt: 'a photo of a swollen or leaking battery', label: 'Damaged battery' },

  // chemicals (4)
  { category: 'chemicals', prompt: 'a photo of a chemical container with a hazard label', label: 'Chemical container' },
  { category: 'chemicals', prompt: 'a photo of a pesticide bottle', label: 'Pesticide container' },
  { category: 'chemicals', prompt: 'a photo of a paint can', label: 'Paint container' },
  { category: 'chemicals', prompt: 'a photo of a bottle of toxic cleaning liquid', label: 'Chemical container' },

  // medical (4)
  { category: 'medical', prompt: 'a photo of medical waste', label: 'Medical waste' },
  { category: 'medical', prompt: 'a photo of used bandages and surgical gloves', label: 'Medical waste' },
  { category: 'medical', prompt: 'a photo of used face masks and medical swabs', label: 'Medical waste' },
  { category: 'medical', prompt: 'a photo of medicine strips and empty vials', label: 'Medicine waste' },

  // general (4)
  { category: 'general', prompt: 'a photo of a plastic water bottle', label: 'Plastic bottle' },
  { category: 'general', prompt: 'a photo of a cardboard box', label: 'Cardboard' },
  { category: 'general', prompt: 'a photo of crumpled paper', label: 'Paper' },
  { category: 'general', prompt: 'a photo of a metal tin can', label: 'Metal can' },

  // unknown (3)
  { category: 'unknown', prompt: 'a photo of a blurry unclear object', label: 'Unidentified item' },
  { category: 'unknown', prompt: 'a photo of a mixed pile of garbage', label: 'Mixed waste (unidentified)' },
  { category: 'unknown', prompt: 'a photo of an unidentifiable object', label: 'Unidentified item' },
] as const;

export const CANDIDATE_LABELS: string[] = CATEGORY_PROMPTS.map((p) => p.prompt);

export const PROMPT_LOOKUP = new Map<string, CategoryPrompt>(
  CATEGORY_PROMPTS.map((p) => [p.prompt, p]),
);
