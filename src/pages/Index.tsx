import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuestionCategory } from '@/types/question';
import { getQuestions } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique custom categories from questions
  const customCategories = useMemo(() => {
    const defaultCategories = ['M', 'E', 'N'];
    const allCategories = questions.map(q => q.category);
    return [...new Set(allCategories.filter(c => !defaultCategories.includes(c)))];
  }, [questions]);

  // Filter questions by selected category
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return questions;
    return questions.filter(q => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

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
  }, []);

  // ✅ Popup removed — now does nothing
  const handleAnswer = (answer: string) => {
    // popup removed
  };

  const AppBar = () => (
    <header className="sticky top-2 z-30">
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-500/70 via-indigo-500/70 to-emerald-400/70 px-4 py-3 shadow-xl shadow-fuchsia-500/25 backdrop-blur-xl transition hover:shadow-2xl hover:shadow-indigo-500/30 md:px-6">
        <div className="flex items-center gap-3 text-white">
          <div className="relative -mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-black uppercase tracking-[0.14em] shadow-inner shadow-black/30">
            Q
          </div>
          <span className="text-xl md:text-2xl font-semibold">Qapp</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full border border-white/60 bg-white/20 text-white shadow-sm shadow-black/20 hover:border-white hover:bg-white/30"
          onClick={() => navigate('/settings')}
          aria-label={t('app.settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );

  const TopControls = ({ showCounter }: { showCounter: boolean }) => {
    const position = showCounter && filteredQuestions.length > 0 ? currentIndex + 1 : 0;
    const total = showCounter ? filteredQuestions.length : 0;

    const handlePositionChange = (value: string) => {
      const nextIndex = Number(value) - 1;
      if (!Number.isNaN(nextIndex)) {
        setCurrentIndex(nextIndex);
      }
    };

    return (
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/80 px-3 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-xl dark:bg-black/60">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 w-24 rounded-lg border-none bg-gradient-to-r from-sky-100 via-emerald-100 to-amber-100 text-sm font-semibold text-foreground shadow-inner shadow-white/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="all" className="text-sm">{t('category.all')}</SelectItem>
              <SelectItem value="M" className="text-sm">M</SelectItem>
              <SelectItem value="E" className="text-sm">E</SelectItem>
              <SelectItem value="N" className="text-sm">N</SelectItem>
              {customCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCounter && (
          <div className="ml-auto rounded-2xl border border-white/10 bg-white/80 px-3 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-xl dark:bg-black/60">
            <Select
              value={position > 0 ? String(position) : ''}
              onValueChange={handlePositionChange}
              disabled={total === 0}
            >
              <SelectTrigger className="h-10 w-28 rounded-lg border border-indigo-100 bg-white text-sm font-semibold text-foreground shadow-sm">
                <SelectValue placeholder={`0 / ${total}`} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {Array.from({ length: total }, (_, idx) => idx + 1).map((num) => (
                  <SelectItem key={num} value={String(num)} className="text-sm">
                    {num} / {total}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredQuestions.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < filteredQuestions.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <AppBar />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <AppBar />
          <div className="flex items-center justify-center">
            <div className="space-y-6 text-center rounded-3xl border border-white/10 bg-white/70 p-10 shadow-xl shadow-primary/15 backdrop-blur-xl dark:bg-black/60">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('app.noQuestions')}
              </h1>
              <p className="text-2xl text-muted-foreground">
                {t('app.addQuestionsFirst')}
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/settings')}
                className="h-16 px-8 text-2xl"
              >
                <Settings className="mr-3 h-8 w-8" />
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
        <div className="max-w-7xl mx-auto space-y-8">
          <AppBar />
          <TopControls showCounter={true} />
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">{t('app.noQuestions')}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <AppBar />

        {/* Question Card */}
        <div className="flex items-center justify-center gap-4">
          {filteredQuestions.length > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrevious}
              className="h-16 w-16 rounded-full p-0 hidden md:flex"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          <div className="flex-1 max-w-4xl">
            <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
          </div>

          {filteredQuestions.length > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={goToNext}
              className="h-16 w-16 rounded-full p-0 hidden md:flex"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {filteredQuestions.length > 1 && (
          <div className="flex gap-4 md:hidden">
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrevious}
              className="flex-1 h-14 text-xl"
            >
              <ChevronLeft className="w-6 h-6 mr-2" />
              {t('app.previous')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goToNext}
              className="flex-1 h-14 text-xl"
            >
              {t('app.next')}
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        )}

        <TopControls showCounter={true} />
      </div>
    </div>
  );
};

export default Index;
