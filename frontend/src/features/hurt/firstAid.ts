// TODO: The first-aid steps below must be verified against official MoHFW/NACO guidance before the final demo.
// Note on emergency numbers: verify 112 (National Emergency) and 102 (Ambulance) for the target city.

export type HurtType = 'needle' | 'cut' | 'chemical' | 'other';

export interface FirstAidStep {
  stepNumber: number;
  textKey: string;
}

export interface FirstAidFlow {
  type: HurtType;
  titleKey: string;
  descKey: string;
  steps: FirstAidStep[];
}

export const FIRST_AID_FLOWS: Record<HurtType, FirstAidFlow> = {
  needle: {
    type: 'needle',
    titleKey: 'hurt.typeNeedle',
    descKey: 'hurt.typeNeedleDesc',
    steps: [
      { stepNumber: 1, textKey: 'firstAid.needle.step1' },
      { stepNumber: 2, textKey: 'firstAid.needle.step2' },
      { stepNumber: 3, textKey: 'firstAid.needle.step3' },
      { stepNumber: 4, textKey: 'firstAid.needle.step4' },
      { stepNumber: 5, textKey: 'firstAid.needle.step5' },
    ],
  },
  cut: {
    type: 'cut',
    titleKey: 'hurt.typeCut',
    descKey: 'hurt.typeCutDesc',
    steps: [
      { stepNumber: 1, textKey: 'firstAid.cut.step1' },
      { stepNumber: 2, textKey: 'firstAid.cut.step2' },
      { stepNumber: 3, textKey: 'firstAid.cut.step3' },
      { stepNumber: 4, textKey: 'firstAid.cut.step4' },
    ],
  },
  chemical: {
    type: 'chemical',
    titleKey: 'hurt.typeChemical',
    descKey: 'hurt.typeChemicalDesc',
    steps: [
      { stepNumber: 1, textKey: 'firstAid.chemical.step1' },
      { stepNumber: 2, textKey: 'firstAid.chemical.step2' },
      { stepNumber: 3, textKey: 'firstAid.chemical.step3' },
      { stepNumber: 4, textKey: 'firstAid.chemical.step4' },
      { stepNumber: 5, textKey: 'firstAid.chemical.step5' },
    ],
  },
  other: {
    type: 'other',
    titleKey: 'hurt.typeOther',
    descKey: 'hurt.typeOtherDesc',
    steps: [
      { stepNumber: 1, textKey: 'firstAid.other.step1' },
      { stepNumber: 2, textKey: 'firstAid.other.step2' },
      { stepNumber: 3, textKey: 'firstAid.other.step3' },
      { stepNumber: 4, textKey: 'firstAid.other.step4' },
    ],
  },
};
