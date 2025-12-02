import { useEffect } from 'react';
import { Question } from '@/types/question';
import { speak } from '@/lib/speech';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  useEffect(() => {
    // Speak question when it loads
    speak(question.text);
  }, [question.id, question.text]);

  const handleAnswer = (answer: string) => {
    speak(answer);
    onAnswer(answer);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-card shadow-[var(--shadow-elevated)] border-2">
      <div className="space-y-8">
        {/* Question section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {question.image && (
            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-primary/20">
              <img 
                src={question.image} 
                alt="Question visual" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              {question.text}
            </h1>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => speak(question.text)}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Volume2 className="w-8 h-8 mr-2" />
              <span className="text-xl">फिर से सुनें</span>
            </Button>
          </div>
        </div>

        {/* Answer section */}
        <div className="pt-6 border-t-4 border-border">
          {question.answerType === 'yesno' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="default"
                size="lg"
                onClick={() => handleAnswer('हाँ')}
                className="h-32 text-4xl font-bold bg-success hover:bg-success/90 text-success-foreground shadow-[var(--shadow-soft)] hover:scale-105 transition-transform"
              >
                हाँ
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => handleAnswer('नहीं')}
                className="h-32 text-4xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[var(--shadow-soft)] hover:scale-105 transition-transform"
              >
                नहीं
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {question.imageAnswers?.map((answer) => (
                <Button
                  key={answer.id}
                  variant="outline"
                  onClick={() => handleAnswer(answer.text)}
                  className="h-auto p-0 overflow-hidden border-4 border-border hover:border-primary hover:scale-105 transition-all group"
                >
                  <div className="w-full">
                    {answer.image ? (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={answer.image}
                          alt={answer.text}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                    <div className="p-4 bg-card">
                      <p className="text-2xl md:text-3xl font-bold text-foreground">
                        {answer.text}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
