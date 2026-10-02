import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import PageContainer from '../components/ui/PageContainer';

interface PlaceholderPageProps {
  titleKey: string;
  icon?: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ titleKey, icon }) => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <h2 className="text-xl font-bold text-ink-900 mb-4">{t(titleKey)}</h2>
      <Card>
        <div className="flex flex-col items-center py-6 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
            {icon ?? <Clock className="w-8 h-8 text-brand-700" aria-hidden="true" />}
          </div>
          <div>
            <p className="font-bold text-ink-900 mb-1">{t('coming_soon.heading')}</p>
            <p className="text-sm text-ink-500">{t('coming_soon.body')}</p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PlaceholderPage;
