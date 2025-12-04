import { useEffect } from "react";
import { Question } from "@/types/question";
import { speak } from "@/lib/speech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    speak(question.text);
  }, [question.id, question.text]);

  const handleAnswer = (answer: string) => {
    speak(answer);
    onAnswer(answer);
  };

  const listenAgainText = language === "hi" ? "फिर से सुनें" : "Listen again";

  /* AUTO COLUMN LOGIC */
  const count = question.imageAnswers?.length || 2;
  const gridCols =
    count === 1
      ? "grid-cols-1"
      : count === 2
      ? "grid-cols-2"
      : count === 3
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <Card
      className="
        w-full max-w-6xl mx-auto p-4 md:p-8 

        /* Portrait = NATURAL height (NO min-height applied) */
        /* Landscape = slight control for better fit */
        landscape:min-h-[75vh]

        bg-gradient-to-br from-card via-card to-primary/5 
        shadow-[var(--shadow-elevated)] border-2 border-primary/20 
        animate-fade-in"
    >
      <div className="space-y-6">

        {/* QUESTION HEADER */}
        <div
          className="flex flex-row items-center gap-4 md:gap-6 
            bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
            p-4 md:p-6 rounded-2xl animate-scale-in"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          {question.image && (
            <div
              className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 
                rounded-xl overflow-hidden border-3 border-primary/30 
                shadow-[var(--shadow-soft)]"
            >
              <img
                src={question.image}
                alt="Question"
                className="w-full h-full object-contain bg-white"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl sm:text-3xl md:text-5xl font-bold 
                text-foreground mb-2 md:mb-3 leading-tight"
            >
              {question.text}
            </h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => speak(question.text)}
              className="text-primary hover:text-primary hover:bg-primary/10 
                h-8 md:h-10"
            >
              <Volume2 className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
              <span className="text-sm md:text-lg">{listenAgainText}</span>
            </Button>
          </div>
        </div>

        {/* ANSWER SECTION */}
        <div
          className="pt-4 animate-fade-in"
          style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
        >
          {/* YES / NO */}
          {question.answerType === "yesno" ? (
            <div
              className="flex flex-row gap-6 md:gap-12 lg:gap-16 
                w-full justify-center items-stretch"
            >
              <Button
                variant="default"
                size="lg"
                onClick={() => handleAnswer(t("app.yes"))}
                className="flex-1 max-w-md h-28 md:h-36 lg:h-40 
                  text-3xl md:text-5xl lg:text-6xl font-bold 
                  bg-gradient-to-br from-success to-success/80 
                  hover:from-success/90 hover:to-success/70 
                  text-success-foreground shadow-[var(--shadow-glow)] 
                  hover:scale-105 transition-transform animate-scale-in"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "backwards",
                }}
              >
                {t("app.yes")}
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={() => handleAnswer(t("app.no"))}
                className="flex-1 max-w-md h-28 md:h-36 lg:h-40 
                  text-3xl md:text-5xl lg:text-6xl font-bold 
                  bg-gradient-to-br from-destructive to-destructive/80 
                  hover:from-destructive/90 hover:to-destructive/70 
                  text-destructive-foreground shadow-[var(--shadow-glow)] 
                  hover:scale-105 transition-transform animate-scale-in"
                style={{
                  animationDelay: "0.5s",
                  animationFillMode: "backwards",
                }}
              >
                {t("app.no")}
              </Button>
            </div>
          ) : (
            /* IMAGE OPTIONS */
            <div className={`grid ${gridCols} gap-4 w-full`}>
              {question.imageAnswers?.map((answer, index) => (
                <Button
                  key={answer.id}
                  variant="outline"
                  onClick={() => handleAnswer(answer.text)}
                  className="
                    h-64 md:h-72 lg:h-80

                    /* Landscape height tweak for single-page fit */
                    landscape:h-[45vh]

                    p-0 overflow-hidden 
                    border-3 border-border rounded-2xl 
                    flex flex-col shadow-lg hover:scale-105 
                    transition-all animate-scale-in"
                  style={{
                    background: `linear-gradient(135deg, hsl(${
                      index * 60
                    } 70% 95%), hsl(${index * 60 + 30} 65% 92%))`,
                    animationDelay: `${0.4 + index * 0.1}s`,
                  }}
                >
                  <div
                    className="
                      w-full h-4/5 flex items-center justify-center 
                      bg-white overflow-hidden"
                  >
                    {answer.image ? (
                      <img
                        src={answer.image}
                        alt={answer.text}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-4xl md:text-5xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-white/90 text-center">
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {answer.text}
                    </p>
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
