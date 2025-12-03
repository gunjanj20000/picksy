import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { getQuestions } from '@/lib/storage';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings, PartyPopper, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAnswer = (answer: string) => {
    toast.success(t('app.yes') + '!', {
      icon: <PartyPopper className="w-6 h-6" />,
      duration: 2000,
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : questions.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < questions.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            {t('app.noQuestions')}
          </h1>
          <p className="text-2xl text-muted-foreground">
            {t('app.addQuestionsFirst')}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/settings')}
            className="text-2xl h-16 px-8"
          >
            <Settings className="w-8 h-8 mr-3" />
            {t('app.goToSettings')}
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-bold">
              {currentIndex + 1}
            </div>
            <span className="text-2xl md:text-3xl text-muted-foreground font-semibold">
              / {questions.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/settings')}
            className="text-lg md:text-xl h-12 md:h-14"
          >
            <Settings className="w-6 h-6 mr-2" />
            {t('app.settings')}
          </Button>
        </div>

        {/* Question Card */}
        <div className="flex items-center justify-center gap-4">
          {questions.length > 1 && (
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

          {questions.length > 1 && (
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
        {questions.length > 1 && (
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
      </div>
    </div>
  );
};

export default Index;
