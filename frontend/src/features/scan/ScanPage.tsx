import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Camera } from 'lucide-react';

const ScanPage: React.FC = () => (
  <PlaceholderPage titleKey="pages.scan" icon={<Camera className="w-8 h-8 text-brand-700" />} />
);

export default ScanPage;
