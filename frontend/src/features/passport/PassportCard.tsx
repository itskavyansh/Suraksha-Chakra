import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, ShieldCheck, MapPin, Wrench, Award, Calendar } from 'lucide-react';
import { PublicPassport } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { PinwheelLogo } from '@/components/ui/PinwheelLogo';

export interface PassportCardProps {
  passport: PublicPassport;
  verifyUrl?: string;
  showQr?: boolean;
  onQrClick?: () => void;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  passport,
  verifyUrl,
  showQr = true,
  onQrClick,
}) => {
  const { t } = useTranslation();

  // Compute initials
  const initials = passport.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      id="printable-passport"
      className="bg-white rounded-3xl border-2 border-brand-700 shadow-card p-5 relative overflow-hidden"
    >
      {/* Decorative background watermark */}
      <div className="absolute -right-8 -top-8 opacity-5 pointer-events-none">
        <PinwheelLogo size={180} />
      </div>

      {/* Header Banner */}
      <div className="flex items-start justify-between pb-3.5 border-b border-ink-100">
        <div className="flex items-center space-x-2.5">
          <PinwheelLogo size={36} />
          <div>
            <h2 className="text-sm font-bold text-brand-900 leading-tight">
              {t('passport.title')}
            </h2>
            <p className="text-[10px] text-brand-700 font-semibold tracking-wide uppercase">
              Suraksha Chakra
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="verified">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-brand-700 inline" />
            <span>{t('common.verified')}</span>
          </Badge>
        </div>
      </div>

      {/* Worker Profile Main Info */}
      <div className="flex items-center space-x-4 my-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-700 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-md">
          {initials || 'SC'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-ink-900 truncate">
            {passport.name}
          </h3>
          <p className="text-xs font-mono font-bold text-brand-700">
            {passport.workerId}
          </p>
          <div className="flex items-center text-xs text-ink-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-ink-400 flex-shrink-0" />
            <span className="truncate">{passport.city}</span>
          </div>
        </div>

        {/* Safety score ring */}
        <div className="flex flex-col items-center justify-center bg-brand-100/70 p-2.5 rounded-2xl border border-brand-500/20 flex-shrink-0">
          <span className="text-lg font-black text-brand-900 leading-none">
            {passport.safetyScore}
          </span>
          <span className="text-[9px] font-bold text-brand-700 uppercase mt-0.5">
            Score
          </span>
        </div>
      </div>

      {/* Skills Chips */}
      {passport.skills.length > 0 && (
        <div className="mb-3.5">
          <div className="flex items-center text-[11px] font-semibold text-ink-500 mb-1.5">
            <Wrench className="w-3 h-3 mr-1 text-ink-400" />
            <span>{t('passport.skills')}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {passport.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-lg bg-ink-100 text-ink-900 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Completed Modules */}
      <div className="mb-4">
        <div className="flex items-center text-[11px] font-semibold text-ink-500 mb-1.5">
          <Award className="w-3 h-3 mr-1 text-ink-400" />
          <span>{t('passport.modulesCompleted')} ({passport.modulesCompleted.length}/5):</span>
        </div>
        <div className="space-y-1">
          {passport.modulesCompleted.length === 0 ? (
            <p className="text-xs text-ink-500 italic">No modules completed yet</p>
          ) : (
            passport.modulesCompleted.map((m) => (
              <div
                key={m.id}
                className="flex items-center text-xs text-brand-900 font-medium bg-brand-100/40 px-2 py-1 rounded-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 mr-1.5 flex-shrink-0" />
                <span className="truncate">{m.title}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Code and Verification Link */}
      {showQr && verifyUrl && (
        <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
          <div
            id="passport-qr"
            onClick={onQrClick}
            className="p-2 bg-white rounded-xl border border-ink-100 shadow-sm cursor-pointer hover:border-brand-500 transition-colors"
            title="Click to enlarge QR code"
          >
            <QRCodeSVG value={verifyUrl} size={88} level="M" />
          </div>

          <div className="flex-1 ml-3.5 min-w-0">
            <span className="text-[10px] text-ink-500 uppercase tracking-wider font-semibold block">
              Scan to verify
            </span>
            <p className="text-[11px] font-mono text-ink-900 font-semibold break-all line-clamp-2 mt-0.5">
              {passport.workerId}
            </p>
            <div className="flex items-center text-[10px] text-ink-500 mt-1">
              <Calendar className="w-3 h-3 mr-1 text-ink-400" />
              <span>{t('passport.lastUpdated')}: {passport.updatedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* Prototype Footer Disclaimer */}
      <div className="mt-3.5 pt-2 border-t border-ink-100/60 text-center">
        <p className="text-[9px] text-ink-500 font-medium">
          {t('passport.subtitle')}
        </p>
      </div>
    </div>
  );
};
