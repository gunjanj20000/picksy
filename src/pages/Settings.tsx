import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '@/lib/storage';
import QuestionForm from '@/components/QuestionForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>(getQuestions());
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (question: Question) => {
    if (editingQuestion) {
      updateQuestion(question.id, question);
    } else {
      addQuestion(question);
    }
    setQuestions(getQuestions());
    setEditingQuestion(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस प्रश्न को हटाना चाहते हैं?')) {
      deleteQuestion(id);
      setQuestions(getQuestions());
      toast.success('प्रश्न हटाया गया');
    }
  };

  if (isAdding || editingQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setIsAdding(false);
              setEditingQuestion(null);
            }}
            className="text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            वापस जाएं
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {editingQuestion ? 'प्रश्न संपादित करें' : 'नया प्रश्न जोड़ें'}
          </h1>

          <QuestionForm
            question={editingQuestion || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setEditingQuestion(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/')}
              className="text-lg mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              मुख्य पृष्ठ
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              प्रश्न प्रबंधन
            </h1>
          </div>
          <Button
            size="lg"
            onClick={() => setIsAdding(true)}
            className="text-xl h-14 px-8"
          >
            <Plus className="w-6 h-6 mr-2" />
            नया प्रश्न
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-2xl text-muted-foreground mb-6">
              कोई प्रश्न नहीं मिला
            </p>
            <Button size="lg" onClick={() => setIsAdding(true)} className="text-xl">
              <Plus className="w-6 h-6 mr-2" />
              पहला प्रश्न जोड़ें
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((question, index) => (
              <Card key={question.id} className="p-6 space-y-4 hover:shadow-[var(--shadow-elevated)] transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                        {index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground line-clamp-2">
                        {question.text}
                      </h3>
                    </div>
                    {question.image && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3 border-2">
                        <img
                          src={question.image}
                          alt="Question"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-muted-foreground text-lg">
                      उत्तर प्रकार:{' '}
                      <span className="font-semibold">
                        {question.answerType === 'yesno' ? 'हाँ/नहीं' : 'तस्वीरें'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuestion(question)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
