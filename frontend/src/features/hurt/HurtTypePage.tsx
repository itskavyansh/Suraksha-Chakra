// TODO: Content must be verified against official MoHFW/NACO guidance before the final demo.
// Emergency numbers comment: verify 112 and 102 for target city.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Phone,
  Navigation,
  FilePlus,
  ShieldAlert,
  Hospital,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/app/routes';
import { api } from '@/data/api';
import { Clinic } from '@/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/components/ui/Toast';
import { FIRST_AID_FLOWS, HurtType } from './firstAid';
import { EmergencyCallBar } from './HurtPage';

export const HurtTypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { speak, stop, isSpeaking } = useSpeech();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);

  const hurtType: HurtType =
    type === 'needle' || type === 'cut' || type === 'chemical' || type === 'other'
      ? type
      : 'other';

  const flow = FIRST_AID_FLOWS[hurtType];
  const steps = flow.steps;
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingClinics(true);
    api.getClinics().then((res) => {
      if (isMounted) {
        setClinics(res);
        setIsLoadingClinics(false);
      }
    });
    return () => {
      isMounted = false;
      stop();
    };
  }, [stop]);

  const currentStep = steps[currentStepIndex];
  const currentStepText = t(currentStep.textKey);

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(currentStepText, () => {
        showToast(t('common.speechNotAvailable'), 'info');
      });
    }
  };

  const handleNext = () => {
    stop();
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    stop();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleOpenDirections = (mapQuery: string) => {
    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Could not open map', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="p-4 space-y-4">
        {/* Medical disclaimer */}
        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-warn-500/15 border border-warn-500/30 text-xs text-amber-950 font-medium">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-800" />
          <span>{t('hurt.disclaimer')}</span>
        </div>

        {/* Title & Step Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-danger-700">
              {t(flow.titleKey)}
            </span>
            <h1 className="text-lg font-extrabold text-ink-900 mt-0.5">
              {t('hurt.stepCounter', {
                current: currentStepIndex + 1,
                total: steps.length,
              })}
            </h1>
          </div>

          {/* Listen Button */}
          <button
            type="button"
            onClick={handleListen}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border min-h-[44px] transition-colors ${
              isSpeaking
                ? 'bg-danger-700 text-white border-danger-700 animate-pulse'
                : 'bg-white border-ink-100 text-ink-900 hover:bg-ink-100'
            }`}
            aria-label={isSpeaking ? 'Stop voice reading' : 'Listen to this step'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t('scan.stop')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-brand-700" />
                <span>{t('scan.listen')}</span>
              </>
            )}
          </button>
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-2xl p-5 border border-ink-100 shadow-card">
          <div className="w-10 h-10 rounded-full bg-danger-100 text-danger-700 font-bold text-sm flex items-center justify-center mb-3">
            {currentStepIndex + 1}
          </div>
          <p className="text-base font-semibold text-ink-900 leading-relaxed">
            {currentStepText}
          </p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="flex-1 border border-ink-100 bg-white"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            {t('common.previous')}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1 font-bold shadow-sm"
            onClick={handleNext}
            disabled={isLastStep}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            {t('common.next')}
          </Button>
        </div>

        {/* Action on last step: Save incident & Nearest Clinics */}
        {isLastStep && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-200">
            {/* Record incident button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full shadow-md font-bold"
              leftIcon={<FilePlus className="w-5 h-5" />}
              onClick={() => navigate(`${ROUTES.hurtLog}?type=${hurtType}`)}
            >
              {t('hurt.saveIncidentBtn')}
            </Button>

            {/* Nearest Clinics List */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <Hospital className="w-4 h-4 text-brand-700" />
                  <h2 className="text-sm font-bold text-ink-900">
                    {t('hurt.nearestClinics')}
                  </h2>
                </div>
                <Badge variant="sample" />
              </div>
              <p className="text-[11px] text-ink-500 mb-3">
                {t('hurt.plannedClinicsNote')}
              </p>

              {isLoadingClinics ? (
                <div className="p-4 text-center text-xs text-ink-500">Loading clinics...</div>
              ) : (
                <div className="space-y-2.5">
                  {clinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="bg-white rounded-xl p-3 border border-ink-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 pr-2">
                          <h3 className="font-bold text-xs text-ink-900 leading-snug">
                            {clinic.name}
                          </h3>
                          <p className="text-[11px] text-ink-500 mt-0.5">{clinic.area}</p>
                          <p className="text-[10px] text-brand-700 font-medium mt-1">
                            {clinic.hours}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3 pt-2.5 border-t border-ink-100">
                        <a
                          href={`tel:${clinic.phone}`}
                          className="flex-1 min-h-[44px] flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-100 text-brand-900 font-semibold text-xs hover:bg-brand-100/80"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t('common.call')} ({clinic.phone})</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenDirections(clinic.mapQuery)}
                          className="flex-1 min-h-[44px] flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ink-100 text-ink-900 font-semibold text-xs hover:bg-ink-100/80"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{t('common.directions')}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Phone Call Bar */}
      <EmergencyCallBar />
    </div>
  );
};
