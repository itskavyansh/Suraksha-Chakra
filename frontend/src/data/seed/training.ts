import { TrainingModule } from '@/types';

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'mod-1',
    titleKey: 'trainingData.mod1.title',
    descKey: 'trainingData.mod1.desc',
    coverIcon: 'Syringe',
    durationMins: 5,
    steps: [
      {
        stepNumber: 1,
        titleKey: 'trainingData.mod1.step1Title',
        contentKey: 'trainingData.mod1.step1Content',
      },
      {
        stepNumber: 2,
        titleKey: 'trainingData.mod1.step2Title',
        contentKey: 'trainingData.mod1.step2Content',
      },
      {
        stepNumber: 3,
        titleKey: 'trainingData.mod1.step3Title',
        contentKey: 'trainingData.mod1.step3Content',
      },
      {
        stepNumber: 4,
        titleKey: 'trainingData.mod1.step4Title',
        contentKey: 'trainingData.mod1.step4Content',
      },
    ],
    quiz: [
      {
        id: 'q1-1',
        questionKey: 'trainingData.mod1.q1Question',
        optionsKeys: [
          'trainingData.mod1.q1Opt1',
          'trainingData.mod1.q1Opt2',
          'trainingData.mod1.q1Opt3',
        ],
        correctIndex: 1,
        explanationKey: 'trainingData.mod1.q1Explain',
      },
      {
        id: 'q1-2',
        questionKey: 'trainingData.mod1.q2Question',
        optionsKeys: [
          'trainingData.mod1.q2Opt1',
          'trainingData.mod1.q2Opt2',
          'trainingData.mod1.q2Opt3',
        ],
        correctIndex: 0,
        explanationKey: 'trainingData.mod1.q2Explain',
      },
      {
        id: 'q1-3',
        questionKey: 'trainingData.mod1.q3Question',
        optionsKeys: [
          'trainingData.mod1.q3Opt1',
          'trainingData.mod1.q3Opt2',
          'trainingData.mod1.q3Opt3',
        ],
        correctIndex: 2,
        explanationKey: 'trainingData.mod1.q3Explain',
      },
    ],
  },
  {
    id: 'mod-2',
    titleKey: 'trainingData.mod2.title',
    descKey: 'trainingData.mod2.desc',
    coverIcon: 'Wine',
    durationMins: 4,
    steps: [
      {
        stepNumber: 1,
        titleKey: 'trainingData.mod2.step1Title',
        contentKey: 'trainingData.mod2.step1Content',
      },
      {
        stepNumber: 2,
        titleKey: 'trainingData.mod2.step2Title',
        contentKey: 'trainingData.mod2.step2Content',
      },
      {
        stepNumber: 3,
        titleKey: 'trainingData.mod2.step3Title',
        contentKey: 'trainingData.mod2.step3Content',
      },
      {
        stepNumber: 4,
        titleKey: 'trainingData.mod2.step4Title',
        contentKey: 'trainingData.mod2.step4Content',
      },
    ],
    quiz: [
      {
        id: 'q2-1',
        questionKey: 'trainingData.mod2.q1Question',
        optionsKeys: [
          'trainingData.mod2.q1Opt1',
          'trainingData.mod2.q1Opt2',
          'trainingData.mod2.q1Opt3',
        ],
        correctIndex: 1,
        explanationKey: 'trainingData.mod2.q1Explain',
      },
      {
        id: 'q2-2',
        questionKey: 'trainingData.mod2.q2Question',
        optionsKeys: [
          'trainingData.mod2.q2Opt1',
          'trainingData.mod2.q2Opt2',
          'trainingData.mod2.q2Opt3',
        ],
        correctIndex: 0,
        explanationKey: 'trainingData.mod2.q2Explain',
      },
      {
        id: 'q2-3',
        questionKey: 'trainingData.mod2.q3Question',
        optionsKeys: [
          'trainingData.mod2.q3Opt1',
          'trainingData.mod2.q3Opt2',
          'trainingData.mod2.q3Opt3',
        ],
        correctIndex: 2,
        explanationKey: 'trainingData.mod2.q3Explain',
      },
    ],
  },
  {
    id: 'mod-3',
    titleKey: 'trainingData.mod3.title',
    descKey: 'trainingData.mod3.desc',
    coverIcon: 'BatteryCharging',
    durationMins: 5,
    steps: [
      {
        stepNumber: 1,
        titleKey: 'trainingData.mod3.step1Title',
        contentKey: 'trainingData.mod3.step1Content',
      },
      {
        stepNumber: 2,
        titleKey: 'trainingData.mod3.step2Title',
        contentKey: 'trainingData.mod3.step2Content',
      },
      {
        stepNumber: 3,
        titleKey: 'trainingData.mod3.step3Title',
        contentKey: 'trainingData.mod3.step3Content',
      },
      {
        stepNumber: 4,
        titleKey: 'trainingData.mod3.step4Title',
        contentKey: 'trainingData.mod3.step4Content',
      },
    ],
    quiz: [
      {
        id: 'q3-1',
        questionKey: 'trainingData.mod3.q1Question',
        optionsKeys: [
          'trainingData.mod3.q1Opt1',
          'trainingData.mod3.q1Opt2',
          'trainingData.mod3.q1Opt3',
        ],
        correctIndex: 2,
        explanationKey: 'trainingData.mod3.q1Explain',
      },
      {
        id: 'q3-2',
        questionKey: 'trainingData.mod3.q2Question',
        optionsKeys: [
          'trainingData.mod3.q2Opt1',
          'trainingData.mod3.q2Opt2',
          'trainingData.mod3.q2Opt3',
        ],
        correctIndex: 1,
        explanationKey: 'trainingData.mod3.q2Explain',
      },
      {
        id: 'q3-3',
        questionKey: 'trainingData.mod3.q3Question',
        optionsKeys: [
          'trainingData.mod3.q3Opt1',
          'trainingData.mod3.q3Opt2',
          'trainingData.mod3.q3Opt3',
        ],
        correctIndex: 0,
        explanationKey: 'trainingData.mod3.q3Explain',
      },
    ],
  },
  {
    id: 'mod-4',
    titleKey: 'trainingData.mod4.title',
    descKey: 'trainingData.mod4.desc',
    coverIcon: 'FlaskConical',
    durationMins: 6,
    steps: [
      {
        stepNumber: 1,
        titleKey: 'trainingData.mod4.step1Title',
        contentKey: 'trainingData.mod4.step1Content',
      },
      {
        stepNumber: 2,
        titleKey: 'trainingData.mod4.step2Title',
        contentKey: 'trainingData.mod4.step2Content',
      },
      {
        stepNumber: 3,
        titleKey: 'trainingData.mod4.step3Title',
        contentKey: 'trainingData.mod4.step3Content',
      },
      {
        stepNumber: 4,
        titleKey: 'trainingData.mod4.step4Title',
        contentKey: 'trainingData.mod4.step4Content',
      },
    ],
    quiz: [
      {
        id: 'q4-1',
        questionKey: 'trainingData.mod4.q1Question',
        optionsKeys: [
          'trainingData.mod4.q1Opt1',
          'trainingData.mod4.q1Opt2',
          'trainingData.mod4.q1Opt3',
        ],
        correctIndex: 1,
        explanationKey: 'trainingData.mod4.q1Explain',
      },
      {
        id: 'q4-2',
        questionKey: 'trainingData.mod4.q2Question',
        optionsKeys: [
          'trainingData.mod4.q2Opt1',
          'trainingData.mod4.q2Opt2',
          'trainingData.mod4.q2Opt3',
        ],
        correctIndex: 2,
        explanationKey: 'trainingData.mod4.q2Explain',
      },
      {
        id: 'q4-3',
        questionKey: 'trainingData.mod4.q3Question',
        optionsKeys: [
          'trainingData.mod4.q3Opt1',
          'trainingData.mod4.q3Opt2',
          'trainingData.mod4.q3Opt3',
        ],
        correctIndex: 0,
        explanationKey: 'trainingData.mod4.q3Explain',
      },
    ],
  },
  {
    id: 'mod-5',
    titleKey: 'trainingData.mod5.title',
    descKey: 'trainingData.mod5.desc',
    coverIcon: 'ShieldAlert',
    durationMins: 5,
    steps: [
      {
        stepNumber: 1,
        titleKey: 'trainingData.mod5.step1Title',
        contentKey: 'trainingData.mod5.step1Content',
      },
      {
        stepNumber: 2,
        titleKey: 'trainingData.mod5.step2Title',
        contentKey: 'trainingData.mod5.step2Content',
      },
      {
        stepNumber: 3,
        titleKey: 'trainingData.mod5.step3Title',
        contentKey: 'trainingData.mod5.step3Content',
      },
      {
        stepNumber: 4,
        titleKey: 'trainingData.mod5.step4Title',
        contentKey: 'trainingData.mod5.step4Content',
      },
    ],
    quiz: [
      {
        id: 'q5-1',
        questionKey: 'trainingData.mod5.q1Question',
        optionsKeys: [
          'trainingData.mod5.q1Opt1',
          'trainingData.mod5.q1Opt2',
          'trainingData.mod5.q1Opt3',
        ],
        correctIndex: 0,
        explanationKey: 'trainingData.mod5.q1Explain',
      },
      {
        id: 'q5-2',
        questionKey: 'trainingData.mod5.q2Question',
        optionsKeys: [
          'trainingData.mod5.q2Opt1',
          'trainingData.mod5.q2Opt2',
          'trainingData.mod5.q2Opt3',
        ],
        correctIndex: 2,
        explanationKey: 'trainingData.mod5.q2Explain',
      },
      {
        id: 'q5-3',
        questionKey: 'trainingData.mod5.q3Question',
        optionsKeys: [
          'trainingData.mod5.q3Opt1',
          'trainingData.mod5.q3Opt2',
          'trainingData.mod5.q3Opt3',
        ],
        correctIndex: 1,
        explanationKey: 'trainingData.mod5.q3Explain',
      },
    ],
  },
];
