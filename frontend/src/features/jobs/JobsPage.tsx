import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Briefcase } from 'lucide-react';

const JobsPage: React.FC = () => (
  <PlaceholderPage titleKey="pages.jobs" icon={<Briefcase className="w-8 h-8 text-info-600" />} />
);

export default JobsPage;
