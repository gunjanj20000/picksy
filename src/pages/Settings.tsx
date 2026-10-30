import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  resetQuestions,
  exportQuestionsToFile,
  importQuestionsFromFile,
} from '@/lib/storage';
import QuestionForm from '@/components/QuestionForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Languages,
  FileQuestion,
  ChevronDown,
  Volume2,
  Database,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { speak, getAvailableVoices } from '@/lib/speech';
import { getSoundEnabled, setSoundEnabled, playPop } from '@/lib/soundEffects';

type QuestionTemplate = 'default' | 'ror';

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate>('default');

  // Audio / Speech settings
  const [soundEnabled, setSoundState] = useState<boolean>(() => getSoundEnabled());
  const [speechRate, setSpeechRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('picksy_speech_rate');
      return saved ? parseFloat(saved) : 0.85;
    } catch {
      return 0.85;
    }
  });
  const [speechPitch, setSpeechPitch] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('picksy_speech_pitch');
      return saved ? parseFloat(saved) : 1.05;
    } catch {
      return 1.05;
    }
  });

  // Load custom categories
  useEffect(() => {
    const saved = localStorage.getItem('custom-categories');
    if (saved) {
      try {
        setCustomCategories(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleAddCustomCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      const updated = [...customCategories, category];
      setCustomCategories(updated);
      localStorage.setItem('custom-categories', JSON.stringify(updated));
    }
  };

  const loadQuestions = async () => {
    try {
      const loaded = await getQuestions();
      setQuestions(loaded);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error(t('settings.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSave = async (question: Question) => {
    setIsSaving(true);
    try {
      if (editingQuestion) {
        await updateQuestion(question.id, question);
        toast.success(t('settings.questionUpdated'));
      } else {
        await addQuestion(question);
        toast.success(t('settings.questionAdded'));
      }
      await loadQuestions();
      setEditingQuestion(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error(t('settings.errorSaving'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    playPop();
    if (window.confirm(t('settings.confirmDelete'))) {
      try {
        await deleteQuestion(id);
        await loadQuestions();
        toast.success(t('settings.questionDeleted'));
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error(t('settings.errorDeleting'));
      }
    }
  };

  const handleLanguageChange = (value: string) => {
    playPop();
    setLanguage(value as Language);
    toast.success(t('settings.languageChanged'));
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundState(enabled);
    setSoundEnabled(enabled);
    if (enabled) playPop();
  };

  const handleRateChange = (values: number[]) => {
    const newRate = values[0];
    setSpeechRate(newRate);
    localStorage.setItem('picksy_speech_rate', String(newRate));
  };

  const handlePitchChange = (values: number[]) => {
    const newPitch = values[0];
    setSpeechPitch(newPitch);
    localStorage.setItem('picksy_speech_pitch', String(newPitch));
  };

  const handleTestSpeech = () => {
    playPop();
    const sample = t('settings.testSpeechSample');
    speak(sample, {
      lang: language,
      rate: speechRate,
      pitch: speechPitch,
    });
  };

  const handleExport = async () => {
    playPop();
    try {
      await exportQuestionsToFile();
      toast.success('Backup file exported!');
    } catch (err) {
      toast.error('Failed to export backup');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importQuestionsFromFile(file);
      await loadQuestions();
      toast.success(`${count} ${t('settings.importSuccess')}`);
    } catch (err) {
      toast.error('Failed to import backup file');
    }
    e.target.value = '';
  };

  const handleResetToDefaults = async () => {
    playPop();
    if (window.confirm(t('settings.resetConfirm'))) {
      try {
        await resetQuestions();
        await loadQuestions();
        toast.success(t('settings.resetSuccess'));
      } catch (err) {
        toast.error('Failed to reset questions');
      }
    }
  };

  const createDefaultQuestion = (template: QuestionTemplate) => {
    playPop();
    const defaultQuestion: Question = {
      id: crypto.randomUUID(),
      text: '',
      image: undefined,
      answerType: template === 'ror' ? 'rightwrong' : 'yesno',
      imageAnswers: template === 'ror' ? undefined : [],
      rightWrongImages: template === 'ror' ? undefined : undefined,
      category: 'M',
      createdAt: Date.now(),
    };
    setSelectedTemplate(template);
    setIsAdding(true);
    setEditingQuestion(defaultQuestion);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  // ADD / EDIT FORM VIEW
  if (isAdding || editingQuestion) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              playPop();
              setIsAdding(false);
              setEditingQuestion(null);
              setSelectedTemplate('default');
            }}
            className="text-lg font-bold rounded-2xl"
            disabled={isSaving}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('settings.goBack')}
          </Button>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100">
            {selectedTemplate === 'ror'
              ? 'Right or Wrong (ROR)'
              : editingQuestion && editingQuestion.text
              ? t('settings.editQuestion')
              : t('settings.addQuestion')}
          </h1>

          <QuestionForm
            question={editingQuestion || undefined}
            onSave={handleSave}
            onCancel={() => {
              playPop();
              setIsAdding(false);
              setEditingQuestion(null);
              setSelectedTemplate('default');
            }}
            isSaving={isSaving}
            customCategories={customCategories}
            onAddCustomCategory={handleAddCustomCategory}
            template={selectedTemplate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                playPop();
                navigate('/');
              }}
              className="text-base font-bold rounded-2xl mb-3 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/80 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 mr-2 text-purple-600" />
              {t('settings.mainPage')}
            </Button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
          </div>
        </div>

        {/* TABS CONTAINER */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 h-14 p-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-purple-200/80 dark:border-purple-800/80 backdrop-blur-xl">
            <TabsTrigger
              value="questions"
              className="rounded-xl font-bold text-xs sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <FileQuestion className="w-4 h-4 mr-1.5 hidden sm:inline" />
              {t('settings.questions')}
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="rounded-xl font-bold text-xs sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Languages className="w-4 h-4 mr-1.5 hidden sm:inline" />
              {t('settings.language')}
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="rounded-xl font-bold text-xs sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Volume2 className="w-4 h-4 mr-1.5 hidden sm:inline" />
              {t('settings.voice')}
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              className="rounded-xl font-bold text-xs sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4 mr-1.5 hidden sm:inline" />
              {t('settings.backup')}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: QUESTIONS LIST */}
          <TabsContent value="questions" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {questions.length} questions offline
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="h-12 px-6 rounded-2xl text-base md:text-lg font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t('settings.newQuestion')}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-2xl border-2">
                  <DropdownMenuItem
                    onClick={() => createDefaultQuestion('default')}
                    className="text-base py-3 rounded-xl font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2.5 text-purple-600" />
                    New Question (Yes/No or Images)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => createDefaultQuestion('ror')}
                    className="text-base py-3 rounded-xl font-bold cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2.5 text-pink-600" />
                    Right or Wrong (ROR)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {questions.length === 0 ? (
              <Card className="p-12 text-center rounded-3xl border-2 border-dashed space-y-4">
                <p className="text-2xl font-bold text-muted-foreground">{t('settings.noQuestions')}</p>
                <Button
                  size="lg"
                  onClick={() => setIsAdding(true)}
                  className="rounded-2xl bg-purple-600 text-white font-bold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('settings.addFirst')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {questions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="p-5 rounded-3xl border-2 border-purple-100 dark:border-purple-900/40 bg-white/90 dark:bg-slate-900/90 shadow-md hover:shadow-xl transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-sm">
                            {index + 1}
                          </span>
                          <Badge className="font-bold text-xs bg-purple-600 text-white">
                            {question.category}
                          </Badge>
                          <Badge variant="outline" className="font-bold text-xs capitalize">
                            {question.answerType}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 line-clamp-2">
                          {question.text}
                        </h3>

                        {question.image && (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border p-1">
                            <img
                              src={question.image}
                              alt="Question thumbnail"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            playPop();
                            setEditingQuestion(question);
                          }}
                          className="h-10 w-10 rounded-xl"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                          className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: LANGUAGE */}
          <TabsContent value="language" className="mt-6">
            <Card className="p-8 max-w-lg rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-6">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {t('settings.selectLanguage')}
              </h2>
              <RadioGroup value={language} onValueChange={handleLanguageChange} className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-purple-100 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 cursor-pointer transition-colors">
                  <RadioGroupItem value="hi" id="hi" className="w-6 h-6 text-purple-600" />
                  <Label htmlFor="hi" className="text-xl font-bold cursor-pointer flex-1">
                    🇮🇳 हिंदी (Hindi)
                  </Label>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-purple-100 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 cursor-pointer transition-colors">
                  <RadioGroupItem value="en" id="en" className="w-6 h-6 text-purple-600" />
                  <Label htmlFor="en" className="text-xl font-bold cursor-pointer flex-1">
                    🇬🇧 English
                  </Label>
                </div>
              </RadioGroup>
            </Card>
          </TabsContent>

          {/* TAB 3: VOICE & SOUND */}
          <TabsContent value="voice" className="mt-6">
            <Card className="p-8 max-w-2xl rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-8">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {t('settings.voice')}
              </h2>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40">
                <div className="space-y-1">
                  <span className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                    {t('settings.soundEffects')}
                  </span>
                  <p className="text-sm text-muted-foreground">{t('settings.soundDesc')}</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
              </div>

              {/* Speech Speed */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                    {t('settings.speechRate')}
                  </Label>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {speechRate.toFixed(2)}x
                  </span>
                </div>
                <Slider
                  value={[speechRate]}
                  min={0.6}
                  max={1.3}
                  step={0.05}
                  onValueChange={handleRateChange}
                  className="py-2"
                />
              </div>

              {/* Speech Pitch */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                    {t('settings.speechPitch')}
                  </Label>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {speechPitch.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[speechPitch]}
                  min={0.8}
                  max={1.4}
                  step={0.05}
                  onValueChange={handlePitchChange}
                  className="py-2"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleTestSpeech}
                  className="h-12 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>{t('settings.testSpeech')}</span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: BACKUP & RESET */}
          <TabsContent value="backup" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EXPORT BACKUP */}
              <Card className="p-6 md:p-8 rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {t('settings.exportButton')}
                </h3>
                <p className="text-sm text-muted-foreground">{t('settings.exportDesc')}</p>
                <Button
                  onClick={handleExport}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  <span>{t('settings.exportButton')}</span>
                </Button>
              </Card>

              {/* IMPORT BACKUP */}
              <Card className="p-6 md:p-8 rounded-3xl border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {t('settings.importButton')}
                </h3>
                <p className="text-sm text-muted-foreground">{t('settings.importDesc')}</p>
                <label className="cursor-pointer flex items-center justify-center w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>{t('settings.importButton')}</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                </label>
              </Card>

              {/* RESTORE STARTER PACK */}
              <Card className="p-6 md:p-8 rounded-3xl border-2 border-rose-200 dark:border-rose-900/50 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-4 md:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {t('settings.resetButton')}
                </h3>
                <p className="text-sm text-muted-foreground">{t('settings.resetDesc')}</p>
                <Button
                  variant="outline"
                  onClick={handleResetToDefaults}
                  className="h-12 px-6 rounded-2xl border-2 border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  <span>{t('settings.resetButton')}</span>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
