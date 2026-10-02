import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  CheckCircle, XCircle, Volume2, VolumeX,
  RotateCcw, BookOpen, Flag,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { GUIDANCE } from '../guidance';
import { CONFIDENCE_THRESHOLD } from '../classifier';
import { useSpeech } from '../hooks/useSpeech';
import { useToast } from '../../../components/ui/Toast';
import { useAppStore } from '../../../store/useAppStore';
import type { ClassificationResult } from '../../../types';

interface ResultViewProps {
  result: ClassificationResult;
  thumb: string | null;
  onScanAnother: () => void;
  onReportHazard: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({
  result, thumb, onScanAnother, onReportHazard,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { language } = useAppStore();
  const { speak, stop, isSpeaking } = useSpeech();

  const guidance = GUIDANCE[result.category];
  const isUnknown = result.category === 'unknown' || result.confidence < CONFIDENCE_THRESHOLD;
  const isSafe = !isUnknown && result.category === 'general';
  const showReport = result.category !== 'general';

  const titleKey = isUnknown
    ? 'scan.result.unknown_treat'
    : isSafe
      ? 'scan.result.looks_safe'
      : 'scan.result.hazard_detected';

  const isDanger = isUnknown || guidance.tone === 'danger';
  const isWarn = !isDanger && guidance.tone === 'warn';

  const toneBorder = isDanger ? 'border-danger-700' : isWarn ? 'border-warn-500' : 'border-brand-500';
  const toneBg = isDanger ? 'bg-danger-100' : isWarn ? 'bg-orange-100' : 'bg-brand-100';
  const toneText = isDanger ? 'text-danger-700' : isWarn ? 'text-orange-500' : 'text-brand-700';
  const barColor = isDanger ? 'bg-danger-700' : isWarn ? 'bg-warn-500' : 'bg-brand-500';

  const handleListen = () => {
    if (isSpeaking) { stop(); return; }
    const dosText = guidance.dos.map((k) => t(k)).join('. ');
    const dontsText = guidance.donts.map((k) => t(k)).join('. ');
    const speechText = `${t(titleKey)}. ${result.label}. ${t('scan.result.do_label')}: ${dosText}. ${t('scan.result.dont_label')}: ${dontsText}.`;
    const lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    const started = speak(speechText, lang);
    if (!started) showToast(t('scan.report.voice_unavailable'), 'info');
  };

  const GuidIcon = guidance.icon;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {thumb && (
        <div className={`rounded-2xl overflow-hidden border-4 ${toneBorder}`}>
          <img src={thumb} alt={result.label} className="w-full object-cover" style={{ maxHeight: '200px' }} />
        </div>
      )}

      {/* Result card */}
      <div className={`rounded-2xl p-4 ${toneBg}`}>
        <div className="flex items-start gap-3 mb-3">
          <GuidIcon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${toneText}`} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className={`text-lg font-bold ${toneText}`} aria-live="polite">
              {t(titleKey)}
            </p>
            <p className="text-ink-900 font-medium text-sm">{result.label}</p>
          </div>
          {result.source === 'model' ? (
            <Badge variant="brand">{t('scan.result.ai_model')}</Badge>
          ) : (
            <Badge variant="neutral">{t('scan.result.demo_classifier')}</Badge>
          )}
        </div>
        <p className="text-xs text-ink-500 mb-1">
          {t('scan.result.confidence')}: {Math.round(result.confidence * 100)}%
        </p>
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.round(result.confidence * 100)}%` }}
          />
        </div>
        {isUnknown && (
          <p className="text-xs text-danger-700 mt-2 font-medium">
            {t('scan.result.unknown_explainer')}
          </p>
        )}
      </div>

      {/* Do / Don't */}
      <div className="bg-white rounded-2xl border border-ink-100 p-4 flex flex-col gap-4">
        <div>
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-2">
            ✓ {t('scan.result.do_label')}
          </p>
          <ul className="flex flex-col gap-1.5">
            {guidance.dos.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-ink-900">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-danger-700 uppercase tracking-wide mb-2">
            ✗ {t('scan.result.dont_label')}
          </p>
          <ul className="flex flex-col gap-1.5">
            {guidance.donts.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-ink-900">
                <XCircle className="w-4 h-4 text-danger-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {showReport && (
          <button
            onClick={onReportHazard}
            className="w-full min-h-[48px] bg-danger-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-800 active:scale-95 transition-all"
          >
            <Flag className="w-4 h-4" aria-hidden="true" />
            {t('scan.result.report_hazard')}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleListen}
            aria-label={isSpeaking ? t('scan.result.stop_listening') : t('scan.result.listen')}
            className="flex-1 min-h-[44px] bg-info-100 text-info-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 active:scale-95 transition-all"
          >
            {isSpeaking
              ? <><VolumeX className="w-4 h-4" aria-hidden="true" />{t('scan.result.stop_listening')}</>
              : <><Volume2 className="w-4 h-4" aria-hidden="true" />{t('scan.result.listen')}</>}
          </button>
          <button
            onClick={onScanAnother}
            className="flex-1 min-h-[44px] bg-brand-100 text-brand-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-700 hover:text-white active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {t('scan.result.scan_another')}
          </button>
        </div>
        <Link
          to="/training"
          className="w-full min-h-[44px] border border-ink-100 text-ink-500 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-ink-100 active:scale-95 transition-all text-sm"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          {t('scan.result.view_training')}
        </Link>
      </div>
    </div>
  );
};

export default ResultView;
