import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { User } from 'lucide-react';

const ProfilePage: React.FC = () => (
  <PlaceholderPage titleKey="pages.profile" icon={<User className="w-8 h-8 text-ink-500" />} />
);

export default ProfilePage;
