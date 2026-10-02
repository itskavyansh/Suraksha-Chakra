import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { GraduationCap } from 'lucide-react';

const TrainingPage: React.FC = () => (
  <PlaceholderPage titleKey="pages.training" icon={<GraduationCap className="w-8 h-8 text-orange-500" />} />
);

export default TrainingPage;
