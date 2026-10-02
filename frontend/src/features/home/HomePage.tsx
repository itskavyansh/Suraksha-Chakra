import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import {
  Camera,
  Briefcase,
  GraduationCap,
  Wallet,
  Recycle,
  User,
} from 'lucide-react';
import Tile from '../../components/ui/Tile';
import PageContainer from '../../components/ui/PageContainer';
import type { LucideIcon } from 'lucide-react';

interface TileConfig {
  icon: LucideIcon;
  labelKey: string;
  to: string;
  bgColor: string;
  iconColor: string;
  prominent?: boolean;
}

const TILES: TileConfig[] = [
  {
    icon: Camera,
    labelKey: 'tiles.scan',
    to: '/scan',
    bgColor: 'bg-brand-100',
    iconColor: 'text-brand-700',
    prominent: true,
  },
  {
    icon: Briefcase,
    labelKey: 'tiles.jobs',
    to: '/jobs',
    bgColor: 'bg-info-100',
    iconColor: 'text-info-600',
  },
  {
    icon: GraduationCap,
    labelKey: 'tiles.training',
    to: '/training',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    icon: Wallet,
    labelKey: 'tiles.earnings',
    to: '/earnings',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Recycle,
    labelKey: 'tiles.recyclers',
    to: '/recyclers',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    icon: User,
    labelKey: 'tiles.profile',
    to: '/profile',
    bgColor: 'bg-ink-100',
    iconColor: 'text-ink-500',
  },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppStore();

  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <PageContainer>
      {/* Greeting card */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-brand-900 to-brand-700 text-white shadow-card flex items-center gap-4">
        {/* Avatar with initials */}
        <div
          className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-lg font-bold"
          aria-hidden="true"
        >
          {user?.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div>
          <p className="text-lg font-bold">
            {t('home.greeting', { name: firstName })}
          </p>
          <p className="text-brand-100 text-sm">{t('home.subtext')}</p>
        </div>
      </div>

      {/* Safety score chip */}
      <div className="mb-5 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-ink-100">
        <div className="flex-1">
          <p className="text-xs text-ink-500 font-medium">Safety Score</p>
          <p className="text-2xl font-extrabold text-brand-700">
            {user?.safetyScore ?? 0}
            <span className="text-sm font-medium text-ink-500">/100</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 flex items-center justify-center">
          <span className="text-xs font-bold text-brand-700">
            {user?.safetyScore ?? 0}
          </span>
        </div>
      </div>

      {/* Tiles grid */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        {TILES.map((tile) => (
          <Tile
            key={tile.to}
            icon={tile.icon}
            label={t(tile.labelKey)}
            to={tile.to}
            bgColor={tile.bgColor}
            iconColor={tile.iconColor}
            prominent={tile.prominent}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default HomePage;
