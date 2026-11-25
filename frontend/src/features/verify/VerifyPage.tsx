import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Share2, Printer, ExternalLink, AlertCircle, ShieldCheck } from 'lucide-react';
import { PublicPassport } from '@/types';
import { api } from '@/data/api';
import { ROUTES } from '@/app/routes';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useToast } from '@/components/ui/Toast';
import { PassportCard } from '@/features/passport/PassportCard';

export const VerifyPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [passport, setPassport] = useState<PublicPassport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const snapshot = searchParams.get('d') || undefined;

  useEffect(() => {
    let isMounted = true;
    if (!workerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.getPublicPassport(workerId, snapshot)
      .then((res) => {
        if (isMounted) {
          setPassport(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPassport(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [workerId, snapshot]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: passport ? `${passport.name} — Suraksha Chakra Passport` : 'Verified Worker Passport',
          url,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast(t('common.copiedToClipboard'));
      }
    } catch {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          showToast(t('common.copiedToClipboard'));
        }
      } catch {
        showToast(t('common.shareFailed'), 'info');
      }
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      showToast('Printing is not supported on this device', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="flex items-center space-x-2 text-ink-500 text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-brand-700 border-t-transparent animate-spin" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex justify-center py-6 px-4">
      <div className="w-full max-w-[430px] flex flex-col space-y-4">
        {/* Top bar with logo and language toggle (Hidden during print) */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-700" />
            <span className="text-xs font-bold text-brand-900 tracking-wide uppercase">
              Suraksha Verify
            </span>
          </div>
          <LanguageToggle />
        </div>

        {/* Demo banner */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-warn-500/15 border border-warn-500/30 text-xs text-amber-950 no-print">
          <span className="font-semibold">{t('passport.bannerDemo')}</span>
          <Badge variant="sample" />
        </div>

        {passport ? (
          <>
            {/* The Verified Passport Card */}
            <PassportCard
              passport={passport}
              showQr={false}
            />

            {/* Verification Actions (Hidden during print) */}
            <div className="space-y-2.5 pt-2 no-print">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
              >
                {t('passport.shareLink')}
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="w-full font-semibold"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrint}
              >
                {t('passport.printPdf')}
              </Button>

              <Button
                variant="ghost"
                size="md"
                className="w-full border border-ink-100 bg-white"
                leftIcon={<ExternalLink className="w-4 h-4" />}
                onClick={() => navigate(ROUTES.landing)}
              >
                {t('passport.openApp')}
              </Button>
            </div>
          </>
        ) : (
          /* Not Found Card */
          <div className="bg-white rounded-2xl p-6 text-center border border-ink-100 shadow-card">
            <div className="w-14 h-14 rounded-full bg-danger-100 text-danger-700 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-ink-900">
              {t('passport.notFound')}
            </h2>
            <p className="text-xs text-ink-500 mt-1 mb-5">
              {t('passport.notFoundDesc')}
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold"
              onClick={() => navigate(ROUTES.landing)}
            >
              {t('passport.openApp')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
