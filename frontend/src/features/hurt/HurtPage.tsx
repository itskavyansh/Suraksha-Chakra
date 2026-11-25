import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Syringe, Scissors, FlaskConical, AlertCircle, Phone, ClipboardList, ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import { Button } from '@/components/ui/Button';

// Verify these numbers (112, 102) for the target city.
export const EmergencyCallBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-16 z-20 w-full bg-white/95 backdrop-blur-md p-3 border-t border-danger-700/20 shadow-md">
      <div className="flex items-center space-x-2">
        <a
          href="tel:112"
          className="flex-1 min-h-[44px] px-3 py-2 bg-danger-700 hover:bg-danger-700/90 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
          aria-label={t('hurt.call112')}
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>Call 112 (Police)</span>
        </a>
        <a
          href="tel:102"
          className="flex-1 min-h-[44px] px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
          aria-label={t('hurt.call102')}
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>Ambulance 102</span>
        </a>
      </div>
    </div>
  );
};

export const HurtPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const options = [
    {
      type: 'needle',
      title: t('hurt.typeNeedle'),
      desc: t('hurt.typeNeedleDesc'),
      icon: Syringe,
      color: 'bg-red-50 text-danger-700 border-red-200',
      iconBg: 'bg-danger-700 text-white',
    },
    {
      type: 'cut',
      title: t('hurt.typeCut'),
      desc: t('hurt.typeCutDesc'),
      icon: Scissors,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-600 text-white',
    },
    {
      type: 'chemical',
      title: t('hurt.typeChemical'),
      desc: t('hurt.typeChemicalDesc'),
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600 text-white',
    },
    {
      type: 'other',
      title: t('hurt.typeOther'),
      desc: t('hurt.typeOtherDesc'),
      icon: AlertCircle,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      iconBg: 'bg-slate-700 text-white',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="p-4 space-y-4">
        {/* Urgent medical guidance alert */}
        <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-danger-100 border border-danger-700/30 text-danger-700">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold block mb-0.5">{t('hurt.disclaimer')}</span>
            <span>Do not wait for symptoms. Select the injury type below for immediate first-aid steps.</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-ink-900">
            {t('hurt.title')}
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            {t('hurt.subtitle')}
          </p>
        </div>

        {/* 4 Big Option Cards */}
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => navigate(ROUTES.hurtType(opt.type))}
                className={`w-full flex items-center p-4 rounded-2xl border text-left shadow-sm hover:shadow-md transition-all active:scale-[0.99] min-h-[72px] ${opt.color}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm ${opt.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm text-ink-900 leading-tight">
                    {opt.title}
                  </h2>
                  <p className="text-xs text-ink-500 mt-1 line-clamp-1">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Link to Injury Log */}
        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            className="w-full font-semibold"
            leftIcon={<ClipboardList className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.hurtLog)}
          >
            View Saved Injury Records ({t('hurt.logTitle')})
          </Button>
        </div>
      </div>

      {/* Emergency Phone Call Bar */}
      <EmergencyCallBar />
    </div>
  );
};
