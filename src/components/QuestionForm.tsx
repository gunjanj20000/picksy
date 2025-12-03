import { useState } from 'react';
import { Question, AnswerType, ImageAnswer } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const QuestionForm = ({ question, onSave, onCancel, isSaving = false }: QuestionFormProps) => {
  const [text, setText] = useState(question?.text || '');
  const [image, setImage] = useState(question?.image || '');
  const [answerType, setAnswerType] = useState<AnswerType>(question?.answerType || 'yesno');
  const [imageAnswers, setImageAnswers] = useState<ImageAnswer[]>(
    question?.imageAnswers || [{ id: '1', image: '', text: '' }]
  );

  const handleImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addImageAnswer = () => {
    setImageAnswers([
      ...imageAnswers,
      { id: Date.now().toString(), image: '', text: '' },
    ]);
  };

  const removeImageAnswer = (id: string) => {
    setImageAnswers(imageAnswers.filter(a => a.id !== id));
  };

  const updateImageAnswer = (id: string, field: 'image' | 'text', value: string) => {
    setImageAnswers(
      imageAnswers.map(a => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('कृपया प्रश्न दर्ज करें');
      return;
    }

    if (answerType === 'images' && imageAnswers.length === 0) {
      toast.error('कृपया कम से कम एक उत्तर जोड़ें');
      return;
    }

    const newQuestion: Question = {
      id: question?.id || Date.now().toString(),
      text: text.trim(),
      image: image || undefined,
      answerType,
      imageAnswers: answerType === 'images' ? imageAnswers : undefined,
    };

    onSave(newQuestion);
    toast.success('प्रश्न सहेजा गया!');
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question-text" className="text-xl font-semibold">
            प्रश्न
          </Label>
          <Input
            id="question-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="प्रश्न यहाँ लिखें..."
            className="text-2xl h-16 border-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xl font-semibold">प्रश्न की तस्वीर (वैकल्पिक)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, setImage);
              }}
              className="flex-1"
            />
            {image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <Tabs value={answerType} onValueChange={(v) => setAnswerType(v as AnswerType)}>
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="yesno" className="text-lg">हाँ/नहीं</TabsTrigger>
            <TabsTrigger value="images" className="text-lg">तस्वीरें</TabsTrigger>
          </TabsList>

          <TabsContent value="yesno" className="mt-4">
            <p className="text-muted-foreground text-center py-4">
              यह प्रश्न हाँ/नहीं बटन के साथ दिखाया जाएगा
            </p>
          </TabsContent>

          <TabsContent value="images" className="mt-4 space-y-4">
            {imageAnswers.map((answer, index) => (
              <Card key={answer.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">उत्तर {index + 1}</Label>
                  {imageAnswers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageAnswer(answer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Input
                  value={answer.text}
                  onChange={(e) => updateImageAnswer(answer.id, 'text', e.target.value)}
                  placeholder="उत्तर का नाम..."
                  className="text-xl h-12"
                />

                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (url) =>
                          updateImageAnswer(answer.id, 'image', url)
                        );
                      }
                    }}
                    className="flex-1"
                  />
                  {answer.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2">
                      <img
                        src={answer.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addImageAnswer}
              className="w-full h-12 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              उत्तर जोड़ें
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button type="submit" size="lg" className="flex-1 text-xl h-14" disabled={isSaving}>
            {isSaving ? 'सहेज रहे हैं...' : 'सहेजें'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="flex-1 text-xl h-14"
            disabled={isSaving}
          >
            रद्द करें
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuestionForm;
