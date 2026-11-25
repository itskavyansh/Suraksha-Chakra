import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/app/routes';
import { TrainingModule } from '@/types';
import { api } from '@/data/api';
import { useSpeech } from '@/hooks/useSpeech';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const TrainingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { speak, stop, isSpeaking } = useSpeech();
  const user = useSessionStore((state) => state.user);
  const updateUser = useSessionStore((state) => state.updateUser);

  const [module, setModule] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(true);

  // Stepper state
  const [stepIndex, setStepIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadModule() {
      try {
        const mods = await api.getTrainingModules();
        const found = mods.find((m) => m.id === id);
        if (mounted) {
          setModule(found || null);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadModule();
    return () => {
      mounted = false;
      stop();
    };
  }, [id, stop]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-ink-500">Loading module...</div>;
  }

  if (!module) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm text-ink-500">Module not found.</p>
        <Button onClick={() => navigate(ROUTES.training)}>{t('training.backToTraining')}</Button>
      </div>
    );
  }

  const currentStep = module.steps[stepIndex];

  const handleSpeakStep = () => {
    if (isSpeaking) {
      stop();
    } else if (currentStep) {
      const text = `${t(currentStep.titleKey)}. ${t(currentStep.contentKey)}`;
      speak(text);
    }
  };

  const handleSelectQuizOption = (questionIndex: number, optionIndex: number) => {
    if (showExplanation[questionIndex]) return; // locked after answering

    const newAnswers = { ...quizAnswers, [questionIndex]: optionIndex };
    setQuizAnswers(newAnswers);
    setShowExplanation({ ...showExplanation, [questionIndex]: true });

    // If this was the last question answered, calculate score
    if (Object.keys(newAnswers).length === module.quiz.length) {
      let score = 0;
      module.quiz.forEach((q, idx) => {
        if (newAnswers[idx] === q.correctIndex) {
          score++;
        }
      });
      setQuizScore(score);
      setQuizFinished(true);

      // Pass threshold: >= 2
      if (score >= 2 && user) {
        api.completeTrainingModule(user.id, module.id, score).then(({ newSafetyScore }) => {
          updateUser({ safetyScore: newSafetyScore });
          showToast(t('training.quizPassed'), 'success');
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowExplanation({});
    setQuizFinished(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(ROUTES.training)}
          className="flex items-center text-xs font-semibold text-ink-500 hover:text-ink-900 transition-colors p-1"
          aria-label={t('training.backToTraining')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>{t('training.title')}</span>
        </button>
        <Badge variant="sample" />
      </div>

      {/* Module Title Banner */}
      <div>
        <h1 className="text-lg font-bold text-ink-900">{t(module.titleKey)}</h1>
        <p className="text-xs text-ink-500 mt-0.5">{t(module.descKey)}</p>
      </div>

      {/* Mode Toggle Tabs */}
      <div className="flex items-center space-x-2 border-b border-ink-100 pb-2">
        <button
          type="button"
          onClick={() => setIsQuizMode(false)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            !isQuizMode
              ? 'bg-brand-100 text-brand-900'
              : 'text-ink-500 hover:text-ink-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Steps ({stepIndex + 1}/{module.steps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setIsQuizMode(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isQuizMode
              ? 'bg-brand-100 text-brand-900'
              : 'text-ink-500 hover:text-ink-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t('training.quizTitle')} (3 Qs)</span>
        </button>
      </div>

      {/* Stepper View */}
      {!isQuizMode && currentStep && (
        <div className="space-y-4">
          {/* Progress Indicators */}
          <div className="flex items-center space-x-1.5">
            {module.steps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  idx === stepIndex
                    ? 'bg-brand-700'
                    : idx < stepIndex
                    ? 'bg-brand-500/40'
                    : 'bg-ink-100'
                }`}
              />
            ))}
          </div>

          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                  Step {stepIndex + 1} of {module.steps.length}
                </span>
                <h2 className="text-base font-bold text-ink-900 mt-1">
                  {t(currentStep.titleKey)}
                </h2>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 p-2 text-ink-500"
                aria-label={isSpeaking ? t('scan.stop') : t('scan.listen')}
                onClick={handleSpeakStep}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 text-danger-700" />
                ) : (
                  <Volume2 className="w-4 h-4 text-brand-700" />
                )}
              </Button>
            </div>

            <p className="text-xs text-ink-900 leading-relaxed whitespace-pre-line bg-ink-100/40 p-3.5 rounded-xl border border-ink-100">
              {t(currentStep.contentKey)}
            </p>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={stepIndex === 0}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              >
                {t('common.back')}
              </Button>

              {stepIndex < module.steps.length - 1 ? (
                <Button
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setStepIndex((prev) => Math.min(module.steps.length - 1, prev + 1))}
                >
                  {t('common.next')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  className="font-bold"
                  rightIcon={<Award className="w-3.5 h-3.5" />}
                  onClick={() => setIsQuizMode(true)}
                >
                  {t('training.quizTitle')}
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Quiz View */}
      {isQuizMode && (
        <div className="space-y-4">
          {!quizFinished ? (
            <div className="space-y-4">
              {module.quiz.map((q, qIdx) => {
                const isAnswered = showExplanation[qIdx];
                const selectedOpt = quizAnswers[qIdx];

                return (
                  <Card key={q.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                      <span>{t('training.questionCount', { current: qIdx + 1, total: module.quiz.length })}</span>
                      {isAnswered && (
                        <span>
                          {selectedOpt === q.correctIndex ? (
                            <span className="text-brand-700 font-bold inline-flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct
                            </span>
                          ) : (
                            <span className="text-danger-700 font-bold inline-flex items-center">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Incorrect
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-ink-900">{t(q.questionKey)}</p>

                    <div className="space-y-2">
                      {q.optionsKeys.map((optKey, optIdx) => {
                        let btnStyle = 'border-ink-100 hover:border-brand-500/40 text-ink-900 bg-white';
                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'border-brand-500 bg-brand-100/50 text-brand-900 font-semibold';
                          } else if (optIdx === selectedOpt) {
                            btnStyle = 'border-danger-700/50 bg-danger-100/40 text-danger-700';
                          } else {
                            btnStyle = 'border-ink-100 opacity-60 text-ink-500';
                          }
                        }

                        return (
                          <button
                            key={optKey}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                            className={`w-full p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{t(optKey)}</span>
                            {isAnswered && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p className="text-xs text-ink-500 bg-ink-100/40 p-2.5 rounded-lg border border-ink-100">
                        {t('training.explanation', { text: t(q.explanationKey) })}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Quiz Results Card */
            <Card className="p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-brand-100 text-brand-700">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-base font-bold text-ink-900">
                  {quizScore >= 2 ? t('training.quizPassed') : t('training.quizFailed')}
                </h2>
                <p className="text-xs text-ink-500 mt-1">
                  {quizScore >= 2
                    ? t('training.quizPassedDesc', { score: quizScore, total: module.quiz.length })
                    : t('training.quizFailedDesc', { score: quizScore, total: module.quiz.length })}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                {quizScore < 2 ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-ink-100"
                      onClick={() => setIsQuizMode(false)}
                    >
                      Review Steps
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={handleResetQuiz}
                    >
                      {t('training.retryQuiz')}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="font-bold w-full"
                    onClick={() => navigate(ROUTES.training)}
                  >
                    {t('training.backToTraining')}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
