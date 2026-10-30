import { useEffect, useState } from "react";
import { Question } from "@/types/question";
import { speak, isSpeaking, stopSpeech } from "@/lib/speech";
import { playDing, playSuccess, playGentleTap, playPop } from "@/lib/soundEffects";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Check, X, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import confetti from "canvas-confetti";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext?: () => void;
}

const QuestionCard = ({ question, onAnswer, onNext }: QuestionCardProps) => {
  const { t, language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imageEnlarged, setImageEnlarged] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setImageEnlarged(false);
    stopSpeech();

    // Auto-read question text
    setSpeaking(true);
    const utterance = speak(question.text, {
      lang: language,
      onEnd: () => {
        setSpeaking(false);
        setImageEnlarged(true);
      },
      onError: () => {
        setSpeaking(false);
        setImageEnlarged(true);
      },
    });

    if (!utterance) {
      setTimeout(() => setImageEnlarged(true), 800);
    }

    return () => {
      stopSpeech();
    };
  }, [question.id, question.text, language]);

  const handleAnswer = (answer: string, id?: string, isPositive: boolean = true) => {
    setSelectedId(id || answer);

    if (isPositive) {
      playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
        });
      } catch {}
    } else {
      playGentleTap();
    }

    speak(answer, { lang: language });
    onAnswer(answer);
  };

  const handleListenAgain = () => {
    setSelectedId(null);
    playPop();
    setSpeaking(true);
    speak(question.text, {
      lang: language,
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'M':
        return { label: t('category.morning'), bg: 'from-amber-400 to-orange-500 text-white' };
      case 'E':
        return { label: t('category.evening'), bg: 'from-pink-500 to-purple-600 text-white' };
      case 'N':
        return { label: t('category.night'), bg: 'from-indigo-600 to-blue-900 text-white' };
      default:
        return { label: cat, bg: 'from-purple-500 to-pink-500 text-white' };
    }
  };

  const badgeInfo = getCategoryBadge(question.category);

  // Dynamic grid column setup
  const count = question.imageAnswers?.length || 2;
  const gridCols =
    count === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : count === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : count === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-2 lg:grid-cols-4';

  return (
    <Card className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 rounded-3xl border-2 border-purple-200/80 dark:border-purple-900/50 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden">
      <div className="space-y-6">
        {/* TOP META ROW */}
        <div className="flex items-center justify-between gap-2">
          <Badge className={`px-4 py-1.5 rounded-full text-sm md:text-base font-bold shadow-sm bg-gradient-to-r ${badgeInfo.bg} border-0`}>
            {badgeInfo.label}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleListenAgain}
            className="rounded-full border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 hover:text-purple-800 transition-all font-semibold gap-2 px-4 py-2"
          >
            {speaking ? (
              <div className="flex items-center gap-1">
                <span className="w-1.5 bg-purple-600 dark:bg-purple-400 rounded-full sound-bar" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 bg-purple-600 dark:bg-purple-400 rounded-full sound-bar" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 bg-purple-600 dark:bg-purple-400 rounded-full sound-bar" style={{ animationDelay: '400ms' }} />
              </div>
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            <span>{t('app.listenAgain')}</span>
          </Button>
        </div>

        {/* QUESTION BANNER */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-slate-900 border border-purple-100/60 dark:border-purple-800/40 shadow-inner">
          {question.image && (
            <div
              className={`flex-shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg transition-all duration-500 ease-out ${
                imageEnlarged
                  ? 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 scale-105 ring-4 ring-purple-400/30'
                  : 'w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36'
              }`}
            >
              <img
                src={question.image}
                alt="Question illustration"
                className="w-full h-full object-contain p-2"
                loading="eager"
              />
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-snug">
              {question.text}
            </h1>
          </div>
        </div>

        {/* ANSWERS CONTAINER */}
        <div className="pt-2">
          {/* 1. YES / NO MODE */}
          {question.answerType === 'yesno' ? (
            <div className="flex flex-col sm:flex-row gap-5 md:gap-8 w-full justify-center items-stretch py-2">
              {/* YES BUTTON */}
              <button
                type="button"
                onClick={() => handleAnswer(t('app.yes'), 'yes', true)}
                disabled={selectedId !== null && selectedId !== 'yes'}
                className={`tactile-button flex-1 min-h-[110px] md:min-h-[140px] rounded-3xl p-6 font-extrabold text-3xl sm:text-4xl md:text-5xl flex items-center justify-center gap-4 transition-all duration-300 text-white shadow-xl ${
                  selectedId === 'yes'
                    ? 'scale-105 ring-8 ring-emerald-300/60 bg-emerald-600 shadow-2xl'
                    : selectedId !== null
                    ? 'opacity-40 grayscale cursor-not-allowed bg-emerald-400'
                    : 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 hover:scale-[1.03] hover:shadow-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm">
                  <ThumbsUp className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <span>{t('app.yes')}</span>
              </button>

              {/* NO BUTTON */}
              <button
                type="button"
                onClick={() => handleAnswer(t('app.no'), 'no', false)}
                disabled={selectedId !== null && selectedId !== 'no'}
                className={`tactile-button flex-1 min-h-[110px] md:min-h-[140px] rounded-3xl p-6 font-extrabold text-3xl sm:text-4xl md:text-5xl flex items-center justify-center gap-4 transition-all duration-300 text-white shadow-xl ${
                  selectedId === 'no'
                    ? 'scale-105 ring-8 ring-rose-300/60 bg-rose-600 shadow-2xl'
                    : selectedId !== null
                    ? 'opacity-40 grayscale cursor-not-allowed bg-rose-400'
                    : 'bg-gradient-to-br from-rose-400 via-rose-500 to-red-600 hover:scale-[1.03] hover:shadow-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm">
                  <ThumbsDown className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <span>{t('app.no')}</span>
              </button>
            </div>
          ) : question.answerType === 'rightwrong' ? (
            /* 2. RIGHT / WRONG (ROR) DUAL COMPARISON */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {question.rightWrongImages?.image1 && (
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                    <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                      <img
                        src={question.rightWrongImages.image1}
                        alt="Option 1"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                )}
                {question.rightWrongImages?.image2 && (
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                    <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
                      <img
                        src={question.rightWrongImages.image2}
                        alt="Option 2"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS: RIGHT / WRONG */}
              <div className="flex flex-col sm:flex-row gap-5 md:gap-8 justify-center items-stretch py-2">
                <button
                  type="button"
                  onClick={() => handleAnswer(t('app.right'), 'right', true)}
                  disabled={selectedId !== null && selectedId !== 'right'}
                  className={`tactile-button flex-1 min-h-[100px] md:min-h-[130px] rounded-3xl p-6 font-extrabold text-3xl sm:text-4xl flex items-center justify-center gap-4 transition-all duration-300 text-white shadow-xl ${
                    selectedId === 'right'
                      ? 'scale-105 ring-8 ring-emerald-300/60 bg-emerald-600 shadow-2xl'
                      : selectedId !== null
                      ? 'opacity-40 grayscale cursor-not-allowed bg-emerald-400'
                      : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:scale-[1.03] hover:shadow-emerald-500/30'
                  }`}
                >
                  {question.rightWrongImages?.rightIcon ? (
                    <img
                      src={question.rightWrongImages.rightIcon}
                      alt="Right"
                      className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-10 h-10 text-white stroke-[4]" />
                    </div>
                  )}
                  <span>{t('app.right')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(t('app.wrong'), 'wrong', false)}
                  disabled={selectedId !== null && selectedId !== 'wrong'}
                  className={`tactile-button flex-1 min-h-[100px] md:min-h-[130px] rounded-3xl p-6 font-extrabold text-3xl sm:text-4xl flex items-center justify-center gap-4 transition-all duration-300 text-white shadow-xl ${
                    selectedId === 'wrong'
                      ? 'scale-105 ring-8 ring-rose-300/60 bg-rose-600 shadow-2xl'
                      : selectedId !== null
                      ? 'opacity-40 grayscale cursor-not-allowed bg-rose-400'
                      : 'bg-gradient-to-br from-rose-500 to-red-600 hover:scale-[1.03] hover:shadow-rose-500/30'
                  }`}
                >
                  {question.rightWrongImages?.wrongIcon ? (
                    <img
                      src={question.rightWrongImages.wrongIcon}
                      alt="Wrong"
                      className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      <X className="w-10 h-10 text-white stroke-[4]" />
                    </div>
                  )}
                  <span>{t('app.wrong')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* 3. MULTIPLE IMAGE OPTIONS */
            <div className={`grid ${gridCols} gap-4 sm:gap-6 w-full py-2`}>
              {question.imageAnswers?.map((answer, index) => {
                const isSelected = selectedId === answer.id;
                const gradients = [
                  'from-purple-500/10 to-indigo-500/10 border-purple-300 dark:border-purple-800',
                  'from-pink-500/10 to-rose-500/10 border-pink-300 dark:border-pink-800',
                  'from-amber-500/10 to-yellow-500/10 border-amber-300 dark:border-amber-800',
                  'from-emerald-500/10 to-teal-500/10 border-emerald-300 dark:border-emerald-800',
                ];
                const gradStyle = gradients[index % gradients.length];

                return (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => handleAnswer(answer.text, answer.id, true)}
                    disabled={selectedId !== null && selectedId !== answer.id}
                    className={`tactile-button group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-3 bg-gradient-to-br ${gradStyle} transition-all duration-300 shadow-lg min-h-[220px] sm:min-h-[250px] md:min-h-[280px] ${
                      isSelected
                        ? 'scale-105 ring-6 ring-purple-400 bg-white dark:bg-slate-800 shadow-2xl z-10'
                        : selectedId !== null
                        ? 'opacity-40 grayscale cursor-not-allowed'
                        : 'hover:scale-[1.03] hover:shadow-xl bg-white/80 dark:bg-slate-800/80'
                    }`}
                  >
                    <div className="w-full flex-1 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-2 mb-3 shadow-inner">
                      {answer.image ? (
                        <img
                          src={answer.image}
                          alt={answer.text}
                          className="w-full h-full max-h-48 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-5xl md:text-6xl">🌟</span>
                      )}
                    </div>

                    <div className="w-full py-2 px-3 rounded-xl bg-white/90 dark:bg-slate-800/90 text-center shadow-sm">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                        {answer.text}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5 shadow-md animate-bounce">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
