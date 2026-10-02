import type { TrainingModule, TrainingProgress } from '../../types';

export const SEED_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'sharps-safety',
    titleKey: 'training.modules.sharps.title',
    durationMin: 4,
    coverIcon: 'AlertTriangle',
    steps: [
      { textKey: 'training.modules.sharps.step1' },
      { textKey: 'training.modules.sharps.step2' },
      { textKey: 'training.modules.sharps.step3' },
      { textKey: 'training.modules.sharps.step4' },
    ],
    quiz: [
      {
        questionKey: 'training.modules.sharps.q1',
        optionKeys: [
          'training.modules.sharps.q1_opt0',
          'training.modules.sharps.q1_opt1',
          'training.modules.sharps.q1_opt2',
        ],
        correctIndex: 1,
      },
      {
        questionKey: 'training.modules.sharps.q2',
        optionKeys: [
          'training.modules.sharps.q2_opt0',
          'training.modules.sharps.q2_opt1',
          'training.modules.sharps.q2_opt2',
        ],
        correctIndex: 0,
      },
      {
        questionKey: 'training.modules.sharps.q3',
        optionKeys: [
          'training.modules.sharps.q3_opt0',
          'training.modules.sharps.q3_opt1',
          'training.modules.sharps.q3_opt2',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'glass-metal',
    titleKey: 'training.modules.glass.title',
    durationMin: 5,
    coverIcon: 'ShieldAlert',
    steps: [
      { textKey: 'training.modules.glass.step1' },
      { textKey: 'training.modules.glass.step2' },
      { textKey: 'training.modules.glass.step3' },
      { textKey: 'training.modules.glass.step4' },
    ],
    quiz: [
      {
        questionKey: 'training.modules.glass.q1',
        optionKeys: [
          'training.modules.glass.q1_opt0',
          'training.modules.glass.q1_opt1',
          'training.modules.glass.q1_opt2',
        ],
        correctIndex: 0,
      },
      {
        questionKey: 'training.modules.glass.q2',
        optionKeys: [
          'training.modules.glass.q2_opt0',
          'training.modules.glass.q2_opt1',
          'training.modules.glass.q2_opt2',
        ],
        correctIndex: 2,
      },
      {
        questionKey: 'training.modules.glass.q3',
        optionKeys: [
          'training.modules.glass.q3_opt0',
          'training.modules.glass.q3_opt1',
          'training.modules.glass.q3_opt2',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'batteries-ewaste',
    titleKey: 'training.modules.batteries.title',
    durationMin: 4,
    coverIcon: 'Zap',
    steps: [
      { textKey: 'training.modules.batteries.step1' },
      { textKey: 'training.modules.batteries.step2' },
      { textKey: 'training.modules.batteries.step3' },
      { textKey: 'training.modules.batteries.step4' },
    ],
    quiz: [
      {
        questionKey: 'training.modules.batteries.q1',
        optionKeys: [
          'training.modules.batteries.q1_opt0',
          'training.modules.batteries.q1_opt1',
          'training.modules.batteries.q1_opt2',
        ],
        correctIndex: 1,
      },
      {
        questionKey: 'training.modules.batteries.q2',
        optionKeys: [
          'training.modules.batteries.q2_opt0',
          'training.modules.batteries.q2_opt1',
          'training.modules.batteries.q2_opt2',
        ],
        correctIndex: 0,
      },
      {
        questionKey: 'training.modules.batteries.q3',
        optionKeys: [
          'training.modules.batteries.q3_opt0',
          'training.modules.batteries.q3_opt1',
          'training.modules.batteries.q3_opt2',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'chemical-containers',
    titleKey: 'training.modules.chemicals.title',
    durationMin: 5,
    coverIcon: 'Droplets',
    steps: [
      { textKey: 'training.modules.chemicals.step1' },
      { textKey: 'training.modules.chemicals.step2' },
      { textKey: 'training.modules.chemicals.step3' },
      { textKey: 'training.modules.chemicals.step4' },
    ],
    quiz: [
      {
        questionKey: 'training.modules.chemicals.q1',
        optionKeys: [
          'training.modules.chemicals.q1_opt0',
          'training.modules.chemicals.q1_opt1',
          'training.modules.chemicals.q1_opt2',
        ],
        correctIndex: 2,
      },
      {
        questionKey: 'training.modules.chemicals.q2',
        optionKeys: [
          'training.modules.chemicals.q2_opt0',
          'training.modules.chemicals.q2_opt1',
          'training.modules.chemicals.q2_opt2',
        ],
        correctIndex: 0,
      },
      {
        questionKey: 'training.modules.chemicals.q3',
        optionKeys: [
          'training.modules.chemicals.q3_opt0',
          'training.modules.chemicals.q3_opt1',
          'training.modules.chemicals.q3_opt2',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'medical-biowaste',
    titleKey: 'training.modules.medical.title',
    durationMin: 6,
    coverIcon: 'HeartPulse',
    steps: [
      { textKey: 'training.modules.medical.step1' },
      { textKey: 'training.modules.medical.step2' },
      { textKey: 'training.modules.medical.step3' },
      { textKey: 'training.modules.medical.step4' },
    ],
    quiz: [
      {
        questionKey: 'training.modules.medical.q1',
        optionKeys: [
          'training.modules.medical.q1_opt0',
          'training.modules.medical.q1_opt1',
          'training.modules.medical.q1_opt2',
        ],
        correctIndex: 1,
      },
      {
        questionKey: 'training.modules.medical.q2',
        optionKeys: [
          'training.modules.medical.q2_opt0',
          'training.modules.medical.q2_opt1',
          'training.modules.medical.q2_opt2',
        ],
        correctIndex: 0,
      },
      {
        questionKey: 'training.modules.medical.q3',
        optionKeys: [
          'training.modules.medical.q3_opt0',
          'training.modules.medical.q3_opt1',
          'training.modules.medical.q3_opt2',
        ],
        correctIndex: 2,
      },
    ],
  },
];

export const SEED_TRAINING_PROGRESS: TrainingProgress[] = [
  {
    moduleId: 'sharps-safety',
    completed: true,
    score: 3,
    completedAt: '2026-09-15T10:30:00Z',
  },
  {
    moduleId: 'glass-metal',
    completed: true,
    score: 2,
    completedAt: '2026-09-22T14:15:00Z',
  },
  {
    moduleId: 'batteries-ewaste',
    completed: false,
    score: null,
    completedAt: null,
  },
  {
    moduleId: 'chemical-containers',
    completed: false,
    score: null,
    completedAt: null,
  },
  {
    moduleId: 'medical-biowaste',
    completed: false,
    score: null,
    completedAt: null,
  },
];
