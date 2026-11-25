import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Calculator,
  QrCode,
  GraduationCap,
  Recycle,
  BookOpen,
  AlertTriangle,
  Camera,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { BRAND } from '@/config/brand';
import { ROUTES } from '@/app/routes';
import { Tile } from '@/components/ui/Tile';
import { Badge } from '@/components/ui/Badge';
import { useSessionStore } from '@/store/sessionStore';
import { api } from '@/data/api';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);
  const [monthEarnings, setMonthEarnings] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    api.getTransactions(user.id).then((txs) => {
      if (isMounted) {
        const total = txs.reduce((sum, tx) => sum + tx.amount, 0);
        setMonthEarnings(total);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) return null;

  // Compute initials
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handlePassportClick = () => {
    navigate(ROUTES.profile);
    setTimeout(() => {
      const el = document.getElementById('passport-id-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4">
      {/* Greeting Card */}
      <div className="bg-white rounded-2xl p-4 border border-ink-100 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-brand-700 text-white font-bold text-base flex items-center justify-center flex-shrink-0 shadow-sm">
              {initials || 'SC'}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-ink-900 truncate">
                {t('home.greeting', { name: user.name })}
              </h2>
              <p className="text-xs text-brand-700 font-medium truncate">
                {t(BRAND.taglineKey)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-brand-100 rounded-full border border-brand-500/20 text-brand-900 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-brand-700" />
              <span>{user.safetyScore}</span>
            </div>
            <span className="text-[10px] text-ink-500 mt-0.5">Safety score</span>
          </div>
        </div>

        {/* Small "My earnings" link */}
        <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(ROUTES.earnings)}
            className="flex items-center text-xs font-semibold text-brand-700 hover:text-brand-900 min-h-[36px]"
          >
            <span>{t('home.myEarningsLink', { amount: monthEarnings.toLocaleString('en-IN') })}</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
          <Badge variant="sample" />
        </div>
      </div>

      {/* Grid of 6 Tiles in exact requested order */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Nearby Jobs */}
        <Tile
          title={t('home.tileJobs')}
          description={t('home.tileJobsDesc')}
          icon={<Briefcase className="w-6 h-6" />}
          tone="brand"
          onClick={() => navigate(ROUTES.jobs)}
        />

        {/* 2. Price Check */}
        <Tile
          title={t('home.tilePriceCheck')}
          description={t('home.tilePriceCheckDesc')}
          icon={<Calculator className="w-6 h-6" />}
          tone="orange"
          onClick={() => navigate(ROUTES.priceCheck)}
        />

        {/* 3. My Passport */}
        <Tile
          title={t('home.tilePassport')}
          description={t('home.tilePassportDesc')}
          icon={<QrCode className="w-6 h-6" />}
          tone="purple"
          onClick={handlePassportClick}
        />

        {/* 4. My Training */}
        <Tile
          title={t('home.tileTraining')}
          description={t('home.tileTrainingDesc')}
          icon={<GraduationCap className="w-6 h-6" />}
          tone="brand"
          onClick={() => navigate(ROUTES.training)}
        />

        {/* 5. Recycler Connect */}
        <Tile
          title={t('home.tileRecyclers')}
          description={t('home.tileRecyclersDesc')}
          icon={<Recycle className="w-6 h-6" />}
          tone="info"
          onClick={() => navigate(ROUTES.recyclers)}
        />

        {/* 6. Hazard Guide */}
        <Tile
          title={t('home.tileGuide')}
          description={t('home.tileGuideDesc')}
          icon={<BookOpen className="w-6 h-6" />}
          tone="warn"
          onClick={() => navigate(ROUTES.guide)}
        />
      </div>

      {/* Full-width red "I got hurt" Tile */}
      <Tile
        isFullWidth
        title={t('home.tileHurt')}
        description={t('home.tileHurtDesc')}
        icon={<AlertTriangle className="w-6 h-6" />}
        tone="danger"
        onClick={() => navigate(ROUTES.hurt)}
      />

      {/* Prominent "Scan Waste" Tile */}
      <Tile
        isFullWidth
        title={t('home.tileScan')}
        description={t('home.tileScanDesc')}
        icon={<Camera className="w-6 h-6" />}
        tone="brand"
        onClick={() => navigate(ROUTES.scan)}
      />
    </div>
  );
};
