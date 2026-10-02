import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import Card from '../../components/ui/Card';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900 mb-6">{t('pages.admin')}</h2>
      <Card>
        <div className="flex flex-col items-center py-8 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-brand-700" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-ink-900 mb-1">{t('coming_soon.heading')}</p>
            <p className="text-sm text-ink-500">{t('admin.coming_soon')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
