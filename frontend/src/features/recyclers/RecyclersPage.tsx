import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Recycle } from 'lucide-react';

const RecyclersPage: React.FC = () => (
  <PlaceholderPage titleKey="pages.recyclers" icon={<Recycle className="w-8 h-8 text-orange-500" />} />
);

export default RecyclersPage;
