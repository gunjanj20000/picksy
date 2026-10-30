import { useState } from 'react';
import { Question, AnswerType, ImageAnswer, QuestionCategory, RightWrongImages } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Crop, Upload, Volume2, Sparkles, Check, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { speak } from '@/lib/speech';
import ImageCropper from './ImageCropper';
import { PRESET_STICKERS } from '@/lib/presetStickers';
import { SVG_ICONS } from '@/lib/seedData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  isSaving?: boolean;
  customCategories?: string[];
  onAddCustomCategory?: (category: string) => void;
  template?: 'default' | 'ror';
}

const QuestionForm = ({
  question,
  onSave,
  onCancel,
  isSaving = false,
  customCategories = [],
  onAddCustomCategory,
  template,
}: QuestionFormProps) => {
  const { t, language } = useLanguage();

  const [text, setText] = useState(question?.text || '');
  const [image, setImage] = useState(question?.image || '');
  const [answerType, setAnswerType] = useState<AnswerType>(
    question?.answerType || (template === 'ror' ? 'rightwrong' : 'yesno')
  );
  const [category, setCategory] = useState<QuestionCategory>(question?.category || 'M');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const [imageAnswers, setImageAnswers] = useState<ImageAnswer[]>(
    question?.imageAnswers && question.imageAnswers.length > 0
      ? question.imageAnswers
      : [
          { id: crypto.randomUUID(), image: '', text: '' },
          { id: crypto.randomUUID(), image: '', text: '' },
        ]
  );

  const [rightWrongImages, setRightWrongImages] = useState<RightWrongImages>(
    question?.rightWrongImages || {
      image1: '',
      image2: '',
      rightIcon: SVG_ICONS.defaultRight,
      wrongIcon: SVG_ICONS.defaultWrong,
    }
  );

  // Cropping state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropTarget, setCropTarget] = useState<'main' | 'rw1' | 'rw2' | 'rwRight' | 'rwWrong' | string>('main');

  // Sticker Picker Modal state
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [stickerTarget, setStickerTarget] = useState<'main' | 'rw1' | 'rw2' | 'rwRight' | 'rwWrong' | string>('main');

  const handleFileUpload = (file: File, target: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropTarget(target);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const applyImageToTarget = (target: string, imageUrl: string) => {
    if (target === 'main') {
      setImage(imageUrl);
    } else if (target === 'rw1') {
      setRightWrongImages((prev) => ({ ...prev, image1: imageUrl }));
    } else if (target === 'rw2') {
      setRightWrongImages((prev) => ({ ...prev, image2: imageUrl }));
    } else if (target === 'rwRight') {
      setRightWrongImages((prev) => ({ ...prev, rightIcon: imageUrl }));
    } else if (target === 'rwWrong') {
      setRightWrongImages((prev) => ({ ...prev, wrongIcon: imageUrl }));
    } else {
      updateImageAnswer(target, 'image', imageUrl);
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    applyImageToTarget(cropTarget, croppedUrl);
    setCropperOpen(false);
    setImageToCrop('');
  };

  const openStickerPicker = (target: string) => {
    setStickerTarget(target);
    setStickerPickerOpen(true);
  };

  const selectSticker = (svgData: string) => {
    applyImageToTarget(stickerTarget, svgData);
    setStickerPickerOpen(false);
  };

  const addImageAnswer = () => {
    setImageAnswers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), image: '', text: '' },
    ]);
  };

  const removeImageAnswer = (id: string) => {
    setImageAnswers((prev) => prev.filter((a) => a.id !== id));
  };

  const updateImageAnswer = (id: string, field: 'image' | 'text', value: string) => {
    setImageAnswers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
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

  const handleTestTTS = () => {
    if (!text.trim()) {
      toast.error(t('form.enterQuestion'));
      return;
    }
    speak(text.trim(), { lang: language });
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

    if (answerType === 'rightwrong' && (!rightWrongImages.image1 || !rightWrongImages.image2)) {
      toast.error(t('form.addBothImages'));
      return;
    }

    const newQuestion: Question = {
      id: question?.id || crypto.randomUUID(),
      text: text.trim(),
      image: image || undefined,
      answerType,
      imageAnswers: answerType === 'images' ? imageAnswers : undefined,
      rightWrongImages: answerType === 'rightwrong' ? rightWrongImages : undefined,
      category,
      createdAt: question?.createdAt || Date.now(),
    };

    onSave(newQuestion);
  };

  return (
    <>
      <Card className="p-6 md:p-8 rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. CATEGORY SELECTION */}
          <div className="space-y-3">
            <Label className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{t('category.label')}</span>
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={category} onValueChange={(val) => setCategory(val)}>
                <SelectTrigger className="w-full sm:w-64 h-12 rounded-xl text-base font-semibold border-purple-200 dark:border-purple-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-purple-200 dark:border-purple-800">
                  <SelectItem value="M" className="text-base py-2.5">
                    {t('category.morning')}
                  </SelectItem>
                  <SelectItem value="E" className="text-base py-2.5">
                    {t('category.evening')}
                  </SelectItem>
                  <SelectItem value="N" className="text-base py-2.5">
                    {t('category.night')}
                  </SelectItem>
                  {customCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-base py-2.5">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!showCustomInput ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomInput(true)}
                  className="rounded-xl h-12 text-sm md:text-base border-purple-200 dark:border-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {t('category.addCustom')}
                </Button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Sports, Colors..."
                    className="h-12 rounded-xl text-base border-purple-200 dark:border-purple-700 w-48"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCustomInput(false)}
                    className="h-12 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 2. QUESTION SENTENCE & TTS PREVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                {t('form.questionText')}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleTestTTS}
                className="text-purple-600 dark:text-purple-400 font-semibold gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-950/50"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test Voice</span>
              </Button>
            </div>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. क्या आपने आज सुबह दाँत साफ़ किए?"
              className="h-14 rounded-2xl text-lg md:text-xl px-4 border-2 border-purple-200 dark:border-purple-700 font-medium"
            />
          </div>

          {/* 3. OPTIONAL MAIN QUESTION IMAGE */}
          <div className="space-y-3 p-4 md:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
            <Label className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200">
              {t('form.questionImage')}
            </Label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {image ? (
                <div className="relative group w-28 h-28 rounded-2xl overflow-hidden border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 shadow-md">
                  <img src={image} alt="Preview" className="w-full h-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 flex flex-col items-center justify-center text-purple-400 bg-white/50 dark:bg-slate-800/50">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs">No image</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>{t('form.uploadImage')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'main');
                    }}
                  />
                </label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openStickerPicker('main')}
                  className="rounded-xl border-purple-200 dark:border-purple-700 font-semibold text-sm h-10 gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{t('form.choosePreset')}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 4. ANSWER TYPE SELECTOR */}
          <div className="space-y-3">
            <Label className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              {t('form.answerType')}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'yesno' as AnswerType, label: t('settings.yesNo'), desc: 'Big Yes / No buttons' },
                { type: 'rightwrong' as AnswerType, label: t('settings.rightWrong'), desc: '2 pictures comparison' },
                { type: 'images' as AnswerType, label: t('settings.images'), desc: 'Visual picture choices' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setAnswerType(opt.type)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    answerType === opt.type
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-4 ring-purple-400/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 bg-white dark:bg-slate-800/60'
                  }`}
                >
                  <div className="font-extrabold text-base md:text-lg text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. DYNAMIC ANSWERS CONFIGURATION */}
          {answerType === 'rightwrong' ? (
            /* ROR SECTION */
            <div className="space-y-4 p-5 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {t('form.questionImages')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PICTURE 1 */}
                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 space-y-3">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                    {t('form.image1')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 flex items-center justify-center">
                      {rightWrongImages.image1 ? (
                        <img src={rightWrongImages.image1} alt="1" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Image 1</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium text-xs">
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'rw1');
                          }}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openStickerPicker('rw1')}
                        className="text-xs h-8"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                        <span>Sticker</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* PICTURE 2 */}
                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 space-y-3">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                    {t('form.image2')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 flex items-center justify-center">
                      {rightWrongImages.image2 ? (
                        <img src={rightWrongImages.image2} alt="2" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Image 2</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium text-xs">
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'rw2');
                          }}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openStickerPicker('rw2')}
                        className="text-xs h-8"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                        <span>Sticker</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : answerType === 'images' ? (
            /* MULTI-CHOICE IMAGE OPTIONS */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {t('form.imageAnswers')}
                </Label>
                <Button
                  type="button"
                  onClick={addImageAnswer}
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('form.addAnswer')}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imageAnswers.map((ans, idx) => (
                  <div
                    key={ans.id}
                    className="p-4 rounded-2xl border-2 border-purple-200/80 dark:border-purple-800 bg-white dark:bg-slate-800/80 shadow-sm space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-purple-600 dark:text-purple-400">
                        Option #{idx + 1}
                      </span>
                      {imageAnswers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImageAnswer(ans.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {ans.image ? (
                          <img src={ans.image} alt={ans.text} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-2xl">🌟</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex gap-2">
                          <label className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium text-xs">
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, ans.id);
                              }}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openStickerPicker(ans.id)}
                            className="text-xs h-8"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                            <span>Sticker</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Input
                      value={ans.text}
                      onChange={(e) => updateImageAnswer(ans.id, 'text', e.target.value)}
                      placeholder="Option label (e.g. दूध / Milk)"
                      className="rounded-xl h-11 text-base border-purple-200 dark:border-purple-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* 6. SUBMIT BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-purple-100 dark:border-purple-800/60">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-14 rounded-2xl text-xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl"
            >
              <Check className="w-6 h-6 mr-2" />
              {isSaving ? t('form.saving') : t('form.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="sm:w-36 h-14 rounded-2xl text-lg font-bold border-2"
            >
              {t('form.cancel')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Image Cropper Modal */}
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        onCancel={() => {
          setCropperOpen(false);
          setImageToCrop('');
        }}
      />

      {/* Preset Stickers Modal */}
      <Dialog open={stickerPickerOpen} onOpenChange={setStickerPickerOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <span>{language === 'hi' ? 'स्टिकर चुनें' : 'Choose a Preset Sticker'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 py-4">
            {PRESET_STICKERS.map((stk) => (
              <button
                key={stk.id}
                type="button"
                onClick={() => selectSticker(stk.svgData)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:scale-105 transition-all shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-inner">
                  <img src={stk.svgData} alt={stk.nameEn} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 text-center line-clamp-1">
                  {language === 'hi' ? stk.nameHi : stk.nameEn}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionForm;
