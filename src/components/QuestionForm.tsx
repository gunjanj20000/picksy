import { useState, useEffect } from 'react';
import { Question, AnswerType, ImageAnswer, QuestionCategory } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageCropper from './ImageCropper';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  isSaving?: boolean;
  customCategories?: string[];
  onAddCustomCategory?: (category: string) => void;
}

const QuestionForm = ({ question, onSave, onCancel, isSaving = false, customCategories = [], onAddCustomCategory }: QuestionFormProps) => {
  const { t, language } = useLanguage();
  const [text, setText] = useState(question?.text || '');
  const [image, setImage] = useState(question?.image || '');
  const [answerType, setAnswerType] = useState<AnswerType>(question?.answerType || 'yesno');
  const [category, setCategory] = useState<QuestionCategory>(question?.category || 'M');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [imageAnswers, setImageAnswers] = useState<ImageAnswer[]>(
    question?.imageAnswers || [{ id: crypto.randomUUID(), image: '', text: '' }]
  );
  
  // Cropping state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropTarget, setCropTarget] = useState<'main' | string>('main');

  const handleImageUpload = (file: File, target: 'main' | string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropTarget(target);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (cropTarget === 'main') {
      setImage(croppedImageUrl);
    } else {
      updateImageAnswer(cropTarget, 'image', croppedImageUrl);
    }
    setCropperOpen(false);
    setImageToCrop('');
  };

  const addImageAnswer = () => {
    setImageAnswers([
      ...imageAnswers,
      { id: crypto.randomUUID(), image: '', text: '' },
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

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && onAddCustomCategory) {
      onAddCustomCategory(customCategory.trim());
      setCategory(customCategory.trim());
      setCustomCategory('');
      setShowCustomInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error(t('form.enterQuestion'));
      return;
    }

    if (answerType === 'images' && imageAnswers.length === 0) {
      toast.error(t('form.addImageAnswers'));
      return;
    }

    const newQuestion: Question = {
      id: question?.id || crypto.randomUUID(),
      text: text.trim(),
      image: image || undefined,
      answerType,
      imageAnswers: answerType === 'images' ? imageAnswers : undefined,
      category,
    };

    onSave(newQuestion);
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label className="text-xl font-semibold">{t('category.label')}</Label>
          <div className="flex gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger className="flex-1 h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="M" className="text-lg">M - {t('category.morning')}</SelectItem>
                <SelectItem value="E" className="text-lg">E - {t('category.evening')}</SelectItem>
                <SelectItem value="N" className="text-lg">N - {t('category.night')}</SelectItem>
                {customCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-lg">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="h-12 px-4"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {showCustomInput && (
            <div className="flex gap-2 mt-2">
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder={t('category.addCustom')}
                className="flex-1 h-12 text-lg"
              />
              <Button type="button" onClick={handleAddCustomCategory} className="h-12">
                {t('form.save')}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-text" className="text-xl font-semibold">
            {t('form.questionText')}
          </Label>
          <Input
            id="question-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('form.questionText')}
            className="text-2xl h-16 border-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xl font-semibold">{t('form.questionImage')}</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'main');
              }}
              className="flex-1"
            />
            {image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 relative group">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageToCrop(image);
                    setCropTarget('main');
                    setCropperOpen(true);
                  }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Crop className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <Tabs value={answerType} onValueChange={(v) => setAnswerType(v as AnswerType)}>
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="yesno" className="text-lg">{t('settings.yesNo')}</TabsTrigger>
            <TabsTrigger value="images" className="text-lg">{t('settings.images')}</TabsTrigger>
          </TabsList>

          <TabsContent value="yesno" className="mt-4">
            <p className="text-muted-foreground text-center py-4">
              {t('settings.yesNo')}
            </p>
          </TabsContent>

          <TabsContent value="images" className="mt-4 space-y-4">
            {imageAnswers.map((answer, index) => (
              <Card key={answer.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">{t('form.answerText')} {index + 1}</Label>
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
                  placeholder={t('form.answerText')}
                  className="text-xl h-12"
                />

                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, answer.id);
                      }
                    }}
                    className="flex-1"
                  />
                  {answer.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 relative group">
                      <img
                        src={answer.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageToCrop(answer.image);
                          setCropTarget(answer.id);
                          setCropperOpen(true);
                        }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Crop className="w-5 h-5 text-white" />
                      </button>
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
              {t('form.addAnswer')}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button type="submit" size="lg" className="flex-1 text-xl h-14" disabled={isSaving}>
            {isSaving ? t('form.saving') : t('form.save')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="flex-1 text-xl h-14"
            disabled={isSaving}
          >
            {t('form.cancel')}
          </Button>
        </div>
      </form>

      <ImageCropper
        imageSrc={imageToCrop}
        open={cropperOpen}
        onCropComplete={handleCropComplete}
        onCancel={() => {
          setCropperOpen(false);
          setImageToCrop('');
        }}
      />
    </Card>
  );
};

export default QuestionForm;
