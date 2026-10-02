import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Wallet } from 'lucide-react';

const EarningsPage: React.FC = () => (
  <PlaceholderPage titleKey="pages.earnings" icon={<Wallet className="w-8 h-8 text-purple-600" />} />
);

export default EarningsPage;
