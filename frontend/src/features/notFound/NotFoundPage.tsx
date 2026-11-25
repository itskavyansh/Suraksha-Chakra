import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/app/routes';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-warn-500/15 flex items-center justify-center text-amber-800 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-ink-900 mb-2">
        {t('common.notFoundTitle')}
      </h1>
      <p className="text-sm text-ink-500 max-w-xs mb-6">
        {t('common.notFoundDesc')}
      </p>
      <Button
        variant="primary"
        onClick={() => navigate(ROUTES.landing)}
        className="w-full max-w-xs"
      >
        {t('common.backToHome')}
      </Button>
    </div>
  );
};
