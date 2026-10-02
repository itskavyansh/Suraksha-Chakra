import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
} from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import api from '../../data/api';
import { useSpeech } from '../scan/hooks/useSpeech';
import { useAppStore } from '../../store/useAppStore';
import type { TrainingModule } from '../../types';

const TrainingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setDemoUser, language } = useAppStore();
  const { speak, stop, isSpeaking } = useSpeech();

  const [module, setModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(true);

  // Flow state
  const [mode, setMode] = useState<'steps' | 'quiz' | 'result'>('steps');
  const [stepIndex, setStepIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    let active = true;
    api.getTrainingModules().then((list) => {
      if (active) {
        const found = list.find((m) => m.id === id);
        setModule(found || null);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      stop();
    };
  }, [id, stop]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!module) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-ink-500 mb-4">{t('errors.something_wrong')}</p>
          <button
            onClick={() => navigate('/training')}
            className="px-4 py-2 bg-brand-700 text-white rounded-xl font-semibold"
          >
            {t('training.back_to_list')}
          </button>
        </div>
      </PageContainer>
    );
  }

  const handleListenStep = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    const currentStepText = t(module.steps[stepIndex].textKey);
    const speechLang = language === 'hi' ? 'hi-IN' : 'en-IN';
    speak(currentStepText, speechLang);
  };

  const handleNextStep = () => {
    stop();
    if (stepIndex < module.steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setMode('quiz');
      setQIndex(0);
      setAnswers({});
      setScore(0);
    }
  };

  const handleBackStep = () => {
    stop();
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (answers[qIndex] !== undefined) return; // already answered
    const currentQ = module.quiz[qIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;
    const newAnswers = { ...answers, [qIndex]: optionIdx };
    setAnswers(newAnswers);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
  };

  const handleNextQuiz = () => {
    if (qIndex < module.quiz.length - 1) {
      setQIndex((prev) => prev + 1);
    } else {
      // Finished quiz
      setMode('result');
      if (score >= 2) {
        api.completeTrainingModule(module.id, score);
        if (user) {
          setDemoUser({
            ...user,
            safetyScore: Math.min(100, user.safetyScore + 5),
          });
        }
      }
    }
  };

  const handleRetryQuiz = () => {
    setMode('quiz');
    setQIndex(0);
    setAnswers({});
    setScore(0);
  };

  const passed = score >= 2;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        {/* Top bar with back button and module title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              stop();
              navigate('/training');
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-ink-100 transition-colors"
            aria-label={t('training.back_to_list')}
          >
            <ArrowLeft className="w-5 h-5 text-ink-900" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-ink-900 truncate">
              {t(module.titleKey)}
            </h2>
            <p className="text-xs text-ink-500">
              {mode === 'steps' && t('training.step', { current: stepIndex + 1, total: module.steps.length })}
              {mode === 'quiz' && t('training.quiz_question', { current: qIndex + 1, total: module.quiz.length })}
              {mode === 'result' && t('training.quiz_title')}
            </p>
          </div>
        </div>

        {/* Steps Mode */}
        {mode === 'steps' && (
          <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {t('training.step', { current: stepIndex + 1, total: module.steps.length })}
              </span>

              <button
                onClick={handleListenStep}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-info-100 text-info-600 text-xs font-semibold hover:bg-blue-100 transition-all active:scale-95"
                aria-label={isSpeaking ? t('training.stop') : t('training.listen')}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{t('training.stop')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{t('training.listen')}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-base text-ink-900 font-medium leading-relaxed min-h-[90px]">
              {t(module.steps[stepIndex].textKey)}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleBackStep}
                disabled={stepIndex === 0}
                className="flex-1 min-h-[44px] border border-ink-100 rounded-xl font-semibold text-sm text-ink-900 hover:bg-ink-100 transition-all disabled:opacity-40"
              >
                {t('training.back')}
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 min-h-[44px] bg-brand-700 text-white rounded-xl font-semibold text-sm hover:bg-brand-900 transition-all active:scale-95 shadow-sm"
              >
                {stepIndex === module.steps.length - 1
                  ? t('training.start_quiz')
                  : t('training.next')}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && (
          <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full self-start">
              {t('training.quiz_question', { current: qIndex + 1, total: module.quiz.length })}
            </span>

            <p className="font-bold text-ink-900 text-base">
              {t(module.quiz[qIndex].questionKey)}
            </p>

            <div className="flex flex-col gap-2.5">
              {module.quiz[qIndex].optionKeys.map((optKey, idx) => {
                const isSelected = answers[qIndex] === idx;
                const answered = answers[qIndex] !== undefined;
                const isCorrect = idx === module.quiz[qIndex].correctIndex;

                let btnStyles = 'border-ink-100 hover:border-brand-500 bg-white text-ink-900';
                if (answered) {
                  if (isCorrect) {
                    btnStyles = 'border-brand-700 bg-brand-100 text-brand-900 font-bold';
                  } else if (isSelected) {
                    btnStyles = 'border-danger-700 bg-danger-100 text-danger-700 font-semibold';
                  } else {
                    btnStyles = 'border-ink-100 opacity-60 text-ink-500';
                  }
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all min-h-[44px] flex items-center justify-between ${btnStyles}`}
                  >
                    <span>{t(optKey)}</span>
                    {answered && isCorrect && <CheckCircle className="w-4 h-4 text-brand-700 flex-shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-danger-700 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answers[qIndex] !== undefined && (
              <div className="pt-2">
                <button
                  onClick={handleNextQuiz}
                  className="w-full min-h-[44px] bg-brand-700 text-white rounded-xl font-bold text-sm hover:bg-brand-900 transition-all active:scale-95"
                >
                  {qIndex < module.quiz.length - 1 ? t('training.next') : t('training.finish')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result Screen */}
        {mode === 'result' && (
          <div className="bg-white border border-ink-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                passed ? 'bg-brand-100 text-brand-700' : 'bg-orange-100 text-orange-600'
              }`}
            >
              {passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
            </div>

            <div>
              <h3 className="text-lg font-bold text-ink-900">
                {passed ? t('training.passed_title') : t('training.failed_title')}
              </h3>
              <p className="text-sm text-ink-500 mt-1 max-w-xs">
                {passed
                  ? t('training.passed_msg', { score })
                  : t('training.failed_msg', { score })}
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              {!passed && (
                <button
                  onClick={handleRetryQuiz}
                  className="w-full min-h-[44px] bg-brand-700 text-white font-bold text-sm rounded-xl hover:bg-brand-900 active:scale-95 transition-all"
                >
                  {t('training.try_again')}
                </button>
              )}
              <button
                onClick={() => navigate('/training')}
                className="w-full min-h-[44px] border border-ink-100 text-ink-900 font-semibold text-sm rounded-xl hover:bg-ink-100 active:scale-95 transition-all"
              >
                {t('training.back_to_list')}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TrainingDetailPage;
