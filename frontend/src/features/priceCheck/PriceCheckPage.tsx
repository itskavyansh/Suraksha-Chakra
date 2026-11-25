import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, ArrowRight, ShieldCheck, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/app/routes';
import { api } from '@/data/api';
import { MaterialRate } from '@/types';
import { evaluateOffer, EvaluationResult } from './evaluateOffer';

export const PriceCheckPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rates, setRates] = useState<MaterialRate[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('pet_plastic');
  const [weight, setWeight] = useState<string>('');
  const [offer, setOffer] = useState<string>('');
  const [result, setResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getMaterialRates().then((res) => {
      if (isMounted) {
        setRates(res);
        if (res.length > 0) {
          setSelectedMaterial(res[0].material);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const currentRate = rates.find((r) => r.material === selectedMaterial);
    const weightNum = parseFloat(weight);
    const offerNum = parseFloat(offer);

    const evalResult = evaluateOffer(
      currentRate ? { minRate: currentRate.minRate, maxRate: currentRate.maxRate } : undefined,
      weightNum,
      offerNum
    );
    setResult(evalResult);
  };

  const handleClear = () => {
    setWeight('');
    setOffer('');
    setResult(null);
  };

  const currentRateObj = rates.find((r) => r.material === selectedMaterial);
  const materialName = currentRateObj ? t(currentRateObj.nameKey) : selectedMaterial;

  const verdictStyles = {
    below: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <TrendingDown className="w-5 h-5 text-amber-700" />,
      title: t('priceCheck.verdictBelow'),
      desc: result
        ? t('priceCheck.verdictDescBelow', {
            weight: weight || '0',
            material: materialName,
            min: result.expectedMin,
            max: result.expectedMax,
          })
        : '',
    },
    within: {
      bg: 'bg-brand-100/60 border-brand-500/40 text-brand-900',
      badge: 'bg-brand-100 text-brand-900 border-brand-500/30',
      icon: <CheckCircle className="w-5 h-5 text-brand-700" />,
      title: t('priceCheck.verdictWithin'),
      desc: result
        ? t('priceCheck.verdictDescWithin', {
            min: result.expectedMin,
            max: result.expectedMax,
          })
        : '',
    },
    above: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: <TrendingUp className="w-5 h-5 text-emerald-700" />,
      title: t('priceCheck.verdictAbove'),
      desc: result
        ? t('priceCheck.verdictDescAbove', {
            min: result.expectedMin,
            max: result.expectedMax,
          })
        : '',
    },
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">
            {t('priceCheck.title')}
          </h1>
          <p className="text-xs text-ink-500 mt-0.5">
            {t('priceCheck.subtitle')}
          </p>
        </div>
        <Badge variant="sample" />
      </div>

      {/* Input Card Form */}
      <Card padding="md">
        <form onSubmit={handleCheck} className="space-y-3.5">
          {/* Material selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('priceCheck.material')}
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => {
                setSelectedMaterial(e.target.value);
                setResult(null);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {rates.map((r) => (
                <option key={r.material} value={r.material}>
                  {t(r.nameKey)} (₹{r.minRate} - ₹{r.maxRate}/kg)
                </option>
              ))}
            </select>
          </div>

          {/* Weight in kg */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('priceCheck.weight')}
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setResult(null);
              }}
              placeholder={t('priceCheck.weightPlaceholder')}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Offer received in INR */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('priceCheck.offer')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-500">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                value={offer}
                onChange={(e) => {
                  setOffer(e.target.value);
                  setResult(null);
                }}
                placeholder={t('priceCheck.offerPlaceholder')}
                className="w-full min-h-[44px] pl-8 pr-3.5 py-2.5 rounded-xl border border-ink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="border border-ink-100"
              onClick={handleClear}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {t('priceCheck.clearBtn')}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-sm"
              disabled={!weight || !offer || parseFloat(weight) <= 0 || parseFloat(offer) <= 0}
              leftIcon={<Calculator className="w-4 h-4" />}
            >
              {t('priceCheck.checkPriceBtn')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Result Card */}
      {result && result.isValid && (
        <div
          className={`p-4 rounded-2xl border shadow-card transition-all duration-200 animate-in fade-in ${
            verdictStyles[result.verdict].bg
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center space-x-2">
              {verdictStyles[result.verdict].icon}
              <h2 className="font-extrabold text-sm">
                {verdictStyles[result.verdict].title}
              </h2>
            </div>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${verdictStyles[result.verdict].badge}`}>
              {result.verdict.toUpperCase()}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium opacity-80">{t('priceCheck.expectedRange')}:</span>
              <span className="font-mono font-bold text-sm">
                ₹{result.expectedMin} — ₹{result.expectedMax}
              </span>
            </div>

            <p className="text-xs leading-relaxed opacity-90">
              {verdictStyles[result.verdict].desc}
            </p>

            <div className="flex items-center space-x-1.5 pt-2 text-[11px] opacity-75">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t('priceCheck.disclaimer')}</span>
            </div>
          </div>

          {/* Button to see recyclers accepting this material */}
          <div className="mt-4 pt-3 border-t border-black/10">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full font-bold bg-white/90 text-brand-900 border border-brand-500/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() =>
                navigate(`${ROUTES.recyclers}?material=${selectedMaterial}`)
              }
            >
              {t('priceCheck.seeRecyclersBtn')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
