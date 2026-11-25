import { HazardReport, HazardCategory } from '@/types';

// ~60 sample hazard reports around Delhi/NCR
// Lat: 28.45 - 28.75, Lng: 77.0 - 77.35, last 30 days
const CATEGORIES: HazardCategory[] = ['sharps', 'glass', 'batteries', 'chemicals', 'medical', 'unknown'];
const LABELS: Record<HazardCategory, string[]> = {
  sharps: ['Used syringe with needle', 'Discarded razor blades', 'Surgical needle', 'Sharp metal edge'],
  glass: ['Broken liquor bottle shards', 'Shattered window glass', 'Broken glass tube', 'Cracked glass container'],
  batteries: ['Swollen Li-ion battery', 'Discarded lead-acid cell', 'Leaking AA battery pile', 'Corroded phone battery'],
  chemicals: ['Acid bottle with corroded cap', 'Pesticide container', 'Chemical cleaning solvent', 'Industrial paint solvent'],
  medical: ['Used surgical gloves & cannula', 'Blood-stained bandage', 'Expired medicine vials', 'Pathology sample container'],
  general: ['Clean PET bottle', 'Cardboard packaging', 'Crushed tin can'],
  unknown: ['Unidentified sealed canister', 'Suspicious mixed waste heap', 'Corroded unlabelled drum'],
};

function generateSampleReports(): HazardReport[] {
  const reports: HazardReport[] = [];
  const baseLat = 28.6139;
  const baseLng = 77.2090;

  for (let i = 1; i <= 60; i++) {
    const cat = CATEGORIES[(i * 3 + 2) % CATEGORIES.length];
    const catLabels = LABELS[cat];
    const label = catLabels[i % catLabels.length];
    
    // Spread coordinates around Delhi/NCR
    const latOffset = ((i * 17) % 60 - 30) * 0.0045; // ~28.47 to ~28.74
    const lngOffset = ((i * 23) % 70 - 35) * 0.0045; // ~77.05 to ~77.36
    const daysAgo = (i % 28) + 1;
    const hoursAgo = (i * 7) % 24;
    
    const date = new Date(Date.now() - (daysAgo * 86400000 + hoursAgo * 3600000));

    // Confidence between 0.72 and 0.98, except unknown which is 0.30 - 0.45
    const confidence = cat === 'unknown'
      ? parseFloat((0.30 + (i % 15) * 0.01).toFixed(2))
      : parseFloat((0.75 + (i % 24) * 0.01).toFixed(2));

    reports.push({
      id: `rep-${i}`,
      category: cat,
      confidence,
      label,
      lat: parseFloat((baseLat + latOffset).toFixed(5)),
      lng: parseFloat((baseLng + lngOffset).toFixed(5)),
      createdAt: date.toISOString(),
      workerId: i % 5 === 0 ? 'demo-ramesh' : `w-${100 + (i % 14)}`,
      imageThumb: null,
    });
  }

  // Sort newest first
  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const SEED_HAZARD_REPORTS: HazardReport[] = generateSampleReports();
