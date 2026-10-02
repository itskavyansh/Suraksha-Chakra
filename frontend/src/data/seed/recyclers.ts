import type { Recycler } from '../../types';

export const SEED_RECYCLERS: Recycler[] = [
  {
    id: 'rec-1',
    name: 'Sample Recycler: Narela Hub',
    area: 'Narela Industrial Area',
    verified: true,
    materials: [
      { name: 'PET Plastic', rateINRPerKg: 16 },
      { name: 'Cardboard', rateINRPerKg: 8 },
      { name: 'Mixed Paper', rateINRPerKg: 10 },
      { name: 'Iron', rateINRPerKg: 28 },
    ],
    phone: '9800000001',
    hours: '8:00 AM – 7:00 PM',
  },
  {
    id: 'rec-2',
    name: 'Sample Recycler: Mayapuri Metal',
    area: 'Mayapuri Phase 2',
    verified: true,
    materials: [
      { name: 'Iron', rateINRPerKg: 30 },
      { name: 'Aluminium', rateINRPerKg: 105 },
      { name: 'Copper', rateINRPerKg: 460 },
      { name: 'Glass', rateINRPerKg: 3 },
    ],
    phone: '9800000002',
    hours: '9:00 AM – 6:30 PM',
  },
  {
    id: 'rec-3',
    name: 'Sample Recycler: Okhla Clean',
    area: 'Okhla Phase 1',
    verified: true,
    materials: [
      { name: 'PET Plastic', rateINRPerKg: 18 },
      { name: 'Cardboard', rateINRPerKg: 9 },
      { name: 'Mixed Paper', rateINRPerKg: 11 },
      { name: 'Aluminium', rateINRPerKg: 98 },
    ],
    phone: '9800000003',
    hours: '8:30 AM – 7:00 PM',
  },
  {
    id: 'rec-4',
    name: 'Sample Recycler: Bawana Yard',
    area: 'Bawana Sector 4',
    verified: true,
    materials: [
      { name: 'Cardboard', rateINRPerKg: 7 },
      { name: 'Mixed Paper', rateINRPerKg: 9 },
      { name: 'Iron', rateINRPerKg: 26 },
      { name: 'Glass', rateINRPerKg: 2.5 },
      { name: 'Copper', rateINRPerKg: 430 },
    ],
    phone: '9800000004',
    hours: '7:30 AM – 6:00 PM',
  },
  {
    id: 'rec-5',
    name: 'Sample Recycler: Anand Parbat',
    area: 'Anand Parbat Industrial',
    verified: true,
    materials: [
      { name: 'PET Plastic', rateINRPerKg: 15 },
      { name: 'Aluminium', rateINRPerKg: 102 },
      { name: 'Copper', rateINRPerKg: 470 },
      { name: 'Iron', rateINRPerKg: 31 },
    ],
    phone: '9800000005',
    hours: '9:00 AM – 8:00 PM',
  },
  {
    id: 'rec-6',
    name: 'Sample Recycler: Ghazipur Local',
    area: 'Ghazipur Mandi Road',
    verified: false, // 1 unverified
    materials: [
      { name: 'Cardboard', rateINRPerKg: 6 },
      { name: 'PET Plastic', rateINRPerKg: 13 },
      { name: 'Glass', rateINRPerKg: 2 },
    ],
    phone: '9800000006',
    hours: '8:00 AM – 5:00 PM',
  },
];
