import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { getQuestions } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Loader2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  WifiOff,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePWA } from '@/hooks/usePWA';
import { getSoundEnabled, setSoundEnabled, playPop, playFanfare } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

const Index = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { isInstallable, promptInstall } = usePWA();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stars, setStars] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(() => getSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load questions from local IndexedDB
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await getQuestions();
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error(t('settings.errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [t]);

  // Unique custom categories
  const customCategories = useMemo(() => {
    const defaultCategories = ['M', 'E', 'N'];
    const allCategories = questions.map((q) => q.category);
    return [...new Set(allCategories.filter((c) => !defaultCategories.includes(c)))];
  }, [questions]);

  // Filter questions by selected category
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return questions;
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsCompleted(false);
  }, [selectedCategory]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playPop();
  };

  const toggleFullscreen = () => {
    playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleLanguage = () => {
    playPop();
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
    toast.success(t('settings.languageChanged'));
  };

  const handleInstallClick = async () => {
    playPop();
    const accepted = await promptInstall();
    if (accepted) {
      toast.success(t('app.installSuccess'));
    }
  };

  const handleAnswerGiven = () => {
    setStars((prev) => prev + 1);

    // Auto advance or check if last question
    if (currentIndex === filteredQuestions.length - 1) {
      setTimeout(() => {
        setIsCompleted(true);
        playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 1200);
    }
  };

  const goToPrevious = useCallback(() => {
    playPop();
    setIsCompleted(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredQuestions.length - 1));
  }, [filteredQuestions.length]);

  const goToNext = useCallback(() => {
    playPop();
    if (currentIndex === filteredQuestions.length - 1) {
      setIsCompleted(true);
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredQuestions.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Progress percentage
  const progressPercent =
    filteredQuestions.length > 0 ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100) : 0;

  // APP BAR
  const AppBar = () => (
    <header className="sticky top-2 z-40">
      <div className="flex items-center justify-between gap-2 rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 px-4 py-3 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white font-black text-xl shadow-md shadow-purple-500/30">
            Q
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                Qapp
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">{t('app.offlineBadge')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Star Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base shadow-sm">
            <span className="text-lg">⭐</span>
            <span>{stars}</span>
          </div>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="h-10 w-10 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-950/50"
            title={soundOn ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundOn ? <Volume2 className="h-5 w-5 text-purple-600" /> : <VolumeX className="h-5 w-5 text-slate-400" />}
          </Button>

          {/* Language Switch */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-10 px-2.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-950/50"
            title="Switch Language"
          >
            {language === 'hi' ? '🇮🇳 HI' : '🇬🇧 EN'}
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-10 w-10 rounded-2xl hidden sm:flex text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-950/50"
            title={t('app.fullscreen')}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>

          {/* Install Button (PWA) */}
          {isInstallable && (
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="h-10 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md"
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span className="hidden md:inline">{t('app.installApp')}</span>
            </Button>
          )}

          {/* Settings button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 shadow-sm"
            onClick={() => {
              playPop();
              navigate('/settings');
            }}
            aria-label={t('app.settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );

  // CATEGORY PILLS BAR
  const CategoryBar = () => {
    const categories = [
      { id: 'all', label: t('category.all'), icon: '🌟' },
      { id: 'M', label: t('category.morning'), icon: '🌅' },
      { id: 'E', label: t('category.evening'), icon: '🌇' },
      { id: 'N', label: t('category.night'), icon: '🌙' },
      ...customCategories.map((cat) => ({ id: cat, label: cat, icon: '🎨' })),
    ];

    const getCount = (catId: string) => {
      if (catId === 'all') return questions.length;
      return questions.filter((q) => q.category === catId).length;
    };

    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCount(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playPop();
                setSelectedCategory(cat.id);
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105 shadow-md shadow-purple-500/25 ring-2 ring-purple-300'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white hover:scale-102 border border-purple-100 dark:border-purple-900/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <AppBar />
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="h-14 w-14 animate-spin text-purple-600" />
            <p className="text-xl font-bold text-slate-600 dark:text-slate-400">
              Loading offline questions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <AppBar />
          <div className="flex items-center justify-center py-16">
            <div className="max-w-lg text-center rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-4xl">
                🎒
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                {t('app.noQuestions')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('app.addQuestionsFirst')}
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/settings')}
                className="h-14 px-8 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl"
              >
                <Settings className="mr-2 h-6 w-6" />
                {t('app.goToSettings')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <AppBar />
          <CategoryBar />
          <div className="text-center py-20 space-y-4">
            <p className="text-2xl font-bold text-muted-foreground">{t('settings.noQuestions')}</p>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory('all')}
              className="rounded-xl font-bold"
            >
              Show All Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] p-3 sm:p-5 md:p-8 flex flex-col justify-between">
      <div className="max-w-6xl w-full mx-auto space-y-5">
        <AppBar />
        <CategoryBar />

        {/* PROGRESS & JUMP SELECTOR */}
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              <span>
                {t('app.question')} {currentIndex + 1} {t('app.of')} {filteredQuestions.length}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3 rounded-full bg-purple-100 dark:bg-purple-950/60" />
          </div>

          {/* Quick jump select */}
          <Select
            value={String(currentIndex + 1)}
            onValueChange={(val) => {
              playPop();
              setCurrentIndex(Number(val) - 1);
              setIsCompleted(false);
            }}
          >
            <SelectTrigger className="w-32 h-10 rounded-xl font-bold border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-800/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl">
              {filteredQuestions.map((_, idx) => (
                <SelectItem key={idx + 1} value={String(idx + 1)} className="font-bold">
                  {idx + 1} / {filteredQuestions.length}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* COMPLETION CARD */}
        {isCompleted ? (
          <div className="flex items-center justify-center py-6 animate-scale-in">
            <div className="w-full max-w-2xl text-center rounded-3xl border-3 border-purple-300 dark:border-purple-700 bg-white/95 dark:bg-slate-900/95 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-400/30 animate-bounce">
                  🏆
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  {t('app.assessmentComplete')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
                  {t('app.thankYou')}
                </p>
              </div>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xl font-black">
                <span>⭐ Total Stars:</span>
                <span className="text-2xl">{stars}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => {
                    playPop();
                    setCurrentIndex(0);
                    setIsCompleted(false);
                  }}
                  className="h-14 px-8 text-xl font-extrabold rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  {t('app.startAgain')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    playPop();
                    setSelectedCategory('all');
                    setCurrentIndex(0);
                    setIsCompleted(false);
                  }}
                  className="h-14 px-6 text-lg font-bold rounded-2xl border-2"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Explore All Questions
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* QUESTION CARD DISPLAY */
          <div className="flex items-center justify-center gap-3 md:gap-5">
            {/* Desktop Left Nav Button */}
            {filteredQuestions.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="h-16 w-16 rounded-full border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-800/80 shadow-lg hidden md:flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
                title={t('app.previous')}
              >
                <ChevronLeft className="w-8 h-8 text-purple-700 dark:text-purple-300" />
              </Button>
            )}

            <div className="flex-1 max-w-4xl">
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswerGiven}
                onNext={goToNext}
              />
            </div>

            {/* Desktop Right Nav Button */}
            {filteredQuestions.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-16 w-16 rounded-full border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-800/80 shadow-lg hidden md:flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
                title={t('app.next')}
              >
                <ChevronRight className="w-8 h-8 text-purple-700 dark:text-purple-300" />
              </Button>
            )}
          </div>
        )}

        {/* MOBILE NAVIGATION BUTTONS */}
        {filteredQuestions.length > 1 && !isCompleted && (
          <div className="flex gap-4 md:hidden pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrevious}
              className="flex-1 h-14 text-xl font-extrabold rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 shadow-md"
            >
              <ChevronLeft className="w-6 h-6 mr-1" />
              {t('app.previous')}
            </Button>
            <Button
              size="lg"
              onClick={goToNext}
              className="flex-1 h-14 text-xl font-extrabold rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
            >
              {t('app.next')}
              <ChevronRight className="w-6 h-6 ml-1" />
            </Button>
          </div>
        )}
      </div>

      <footer className="text-center py-4 text-xs font-semibold text-muted-foreground">
        <span>Qapp • 100% Offline Progressive Web App</span>
      </footer>
    </div>
  );
};

export default Index;
