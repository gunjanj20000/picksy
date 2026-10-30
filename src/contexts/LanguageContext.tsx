import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & App
    'app.title': 'Qapp - Child Learning',
    'app.startAssessment': 'Start Learning',
    'app.settings': 'Settings',
    'app.noQuestions': 'No questions found',
    'app.addQuestionsFirst': 'Please add questions or reset to starter pack',
    'app.goToSettings': 'Go to Settings',
    'app.question': 'Question',
    'app.of': 'of',
    'app.yes': 'Yes',
    'app.no': 'No',
    'app.right': 'Right',
    'app.wrong': 'Wrong',
    'app.next': 'Next',
    'app.previous': 'Previous',
    'app.finish': 'Finish',
    'app.assessmentComplete': 'Terrific Job! 🎉',
    'app.thankYou': 'You have completed this learning session!',
    'app.startAgain': 'Start Again',
    'app.listenAgain': 'Listen Again',
    'app.offlineBadge': '100% Offline',
    'app.installApp': 'Install App',
    'app.installSuccess': 'App installed successfully!',
    'app.fullscreen': 'Fullscreen',
    'app.stars': 'Stars',

    // Settings
    'settings.title': 'Learning Hub & Settings',
    'settings.mainPage': 'Back to Learn',
    'settings.newQuestion': 'New Question',
    'settings.noQuestions': 'No questions in this category',
    'settings.addFirst': 'Add First Question',
    'settings.editQuestion': 'Edit Question',
    'settings.addQuestion': 'Add New Question',
    'settings.goBack': 'Go Back',
    'settings.answerType': 'Answer Type',
    'settings.yesNo': 'Yes / No',
    'settings.images': 'Visual Pictures',
    'settings.rightWrong': 'Right or Wrong (ROR)',
    'settings.questionUpdated': 'Question saved successfully',
    'settings.questionAdded': 'Question created successfully',
    'settings.questionDeleted': 'Question deleted',
    'settings.errorLoading': 'Error loading questions',
    'settings.errorSaving': 'Error saving question',
    'settings.errorDeleting': 'Error deleting question',
    'settings.confirmDelete': 'Are you sure you want to delete this question?',
    'settings.questions': 'Questions',
    'settings.language': 'Language',
    'settings.voice': 'Voice & Sound',
    'settings.backup': 'Backup & Reset',
    'settings.selectLanguage': 'Choose Application Language',
    'settings.languageChanged': 'Language updated',
    'settings.soundEffects': 'Sound Effects (Chimes & Dings)',
    'settings.soundDesc': 'Play cheerful sounds when selecting answers and completing questions',
    'settings.speechRate': 'Speech Speed',
    'settings.speechPitch': 'Voice Pitch',
    'settings.testSpeech': 'Test Voice Preview',
    'settings.testSpeechSample': 'Hello! Let us learn and have fun today!',
    'settings.exportDesc': 'Download all your questions and images as a local JSON file to backup or share between devices.',
    'settings.exportButton': 'Export Questions Backup',
    'settings.importDesc': 'Load questions and pictures from a previously exported backup file.',
    'settings.importButton': 'Import Backup File',
    'settings.importSuccess': 'questions imported successfully!',
    'settings.resetDesc': 'Restore original built-in starter pack questions (Morning, Evening, Night routines with illustrations).',
    'settings.resetButton': 'Restore Default Starter Pack',
    'settings.resetConfirm': 'Are you sure you want to restore the default questions? Your current list will be reset.',
    'settings.resetSuccess': 'Starter pack questions restored!',

    // Categories
    'category.label': 'Routine Category',
    'category.morning': 'Morning 🌅',
    'category.evening': 'Evening 🌇',
    'category.night': 'Night 🌙',
    'category.custom': 'Custom',
    'category.addCustom': 'Add Custom Category',
    'category.all': 'All Routines',
    'category.selectCategory': 'Select Category',

    // Question form
    'form.questionText': 'Question Text (Spoken by TTS)',
    'form.questionImage': 'Question Card Image (Optional)',
    'form.uploadImage': 'Upload Image / Photo',
    'form.choosePreset': 'Pick Sticker',
    'form.cropImage': 'Crop & Adjust',
    'form.answerType': 'Answer Format',
    'form.imageAnswers': 'Visual Answer Choices',
    'form.addAnswer': 'Add Visual Option',
    'form.answerText': 'Option Label / Text',
    'form.questionImages': 'Comparison Pictures',
    'form.answerIcons': 'Right & Wrong Badges',
    'form.image1': 'Picture 1 (e.g. Clean habit)',
    'form.image2': 'Picture 2 (e.g. Incorrect habit)',
    'form.rightIcon': 'Right Check Icon',
    'form.wrongIcon': 'Wrong Cross Icon',
    'form.addBothImages': 'Please provide both images for comparison',
    'form.addAllRightWrongImages': 'Please add comparison images',
    'form.save': 'Save Question',
    'form.cancel': 'Cancel',
    'form.saving': 'Saving...',
    'form.enterQuestion': 'Please enter a question sentence',
    'form.addImageAnswers': 'Please add at least one image choice',
  },
  hi: {
    // Header & App
    'app.title': 'Qapp - बाल शिक्षण',
    'app.startAssessment': 'सीखना शुरू करें',
    'app.settings': 'सेटिंग्स',
    'app.noQuestions': 'कोई प्रश्न नहीं मिला',
    'app.addQuestionsFirst': 'कृपया नए प्रश्न जोड़ें या स्टार्टर पैक रीसेट करें',
    'app.goToSettings': 'सेटिंग्स खोलें',
    'app.question': 'प्रश्न',
    'app.of': 'का',
    'app.yes': 'हाँ',
    'app.no': 'नहीं',
    'app.right': 'सही',
    'app.wrong': 'गलत',
    'app.next': 'अगला',
    'app.previous': 'पिछला',
    'app.finish': 'समाप्त',
    'app.assessmentComplete': 'बहुत बढ़िया! शाबाश! 🎉',
    'app.thankYou': 'आपने सभी प्रश्नों का अभ्यास पूरा कर लिया!',
    'app.startAgain': 'फिर से शुरू करें',
    'app.listenAgain': 'फिर से सुनें',
    'app.offlineBadge': '100% ऑफ़लाइन',
    'app.installApp': 'ऐप इंस्टॉल करें',
    'app.installSuccess': 'ऐप सफलतापूर्वक इंस्टॉल हो गया!',
    'app.fullscreen': 'फुल स्क्रीन',
    'app.stars': 'सितारे',

    // Settings
    'settings.title': 'प्रश्न प्रबंधन और सेटिंग्स',
    'settings.mainPage': 'अभ्यास पर वापस जाएं',
    'settings.newQuestion': 'नया प्रश्न',
    'settings.noQuestions': 'इस श्रेणी में कोई प्रश्न नहीं है',
    'settings.addFirst': 'पहला प्रश्न जोड़ें',
    'settings.editQuestion': 'प्रश्न संपादित करें',
    'settings.addQuestion': 'नया प्रश्न जोड़ें',
    'settings.goBack': 'वापस जाएं',
    'settings.answerType': 'उत्तर का प्रकार',
    'settings.yesNo': 'हाँ / नहीं',
    'settings.images': 'तस्वीर विकल्प',
    'settings.rightWrong': 'सही या गलत (ROR)',
    'settings.questionUpdated': 'प्रश्न सहेजा गया',
    'settings.questionAdded': 'नया प्रश्न जोड़ा गया',
    'settings.questionDeleted': 'प्रश्न हटा दिया गया',
    'settings.errorLoading': 'प्रश्न लोड करने में त्रुटि',
    'settings.errorSaving': 'प्रश्न सहेजने में त्रुटि',
    'settings.errorDeleting': 'प्रश्न हटाने में त्रुटि',
    'settings.confirmDelete': 'क्या आप वाकई इस प्रश्न को हटाना चाहते हैं?',
    'settings.questions': 'प्रश्न',
    'settings.language': 'भाषा',
    'settings.voice': 'आवाज़ व ध्वनि',
    'settings.backup': 'बैकअप व रीसेट',
    'settings.selectLanguage': 'ऐप की भाषा चुनें',
    'settings.languageChanged': 'भाषा बदल दी गई',
    'settings.soundEffects': 'ध्वनि प्रभाव (चाइम और पॉप)',
    'settings.soundDesc': 'उत्तर चुनने और प्रश्न पूरा करने पर खुशगवार आवाज़ बजाएं',
    'settings.speechRate': 'बोलने की गति (Speed)',
    'settings.speechPitch': 'आवाज़ का सुर (Pitch)',
    'settings.testSpeech': 'आवाज़ का नमूना सुनें',
    'settings.testSpeechSample': 'नमस्ते! आइए आज मिलकर मज़े से सीखें!',
    'settings.exportDesc': 'अपने सभी प्रश्नों और तस्वीरों को ऑफ़लाइन JSON फ़ाइल के रूप में सहेजें।',
    'settings.exportButton': 'प्रश्नों का बैकअप डाउनलोड करें',
    'settings.importDesc': 'पहले से सहेजी गई बैकअप फ़ाइल से प्रश्न और तस्वीरें लोड करें।',
    'settings.importButton': 'बैकअप फ़ाइल लोड करें',
    'settings.importSuccess': 'प्रश्न सफलतापूर्वक लोड किए गए!',
    'settings.resetDesc': 'मूल स्टार्टर पैक (सुबह, शाम, रात की दिनचर्या और तस्वीरें) पुनः लोड करें।',
    'settings.resetButton': 'डिफ़ॉल्ट स्टार्टर पैक रीसेट करें',
    'settings.resetConfirm': 'क्या आप निश्चित रूप से डिफ़ॉल्ट प्रश्न पुनर्स्थापित करना चाहते हैं?',
    'settings.resetSuccess': 'स्टार्टर पैक प्रश्न सफलतापूर्वक लोड हो गए!',

    // Categories
    'category.label': 'दिनचर्या श्रेणी',
    'category.morning': 'सुबह 🌅',
    'category.evening': 'शाम 🌇',
    'category.night': 'रात 🌙',
    'category.custom': 'कस्टम',
    'category.addCustom': 'कस्टम श्रेणी जोड़ें',
    'category.all': 'सभी दिनचर्या',
    'category.selectCategory': 'श्रेणी चुनें',

    // Question form
    'form.questionText': 'प्रश्न वाक्य (TTS द्वारा पढ़ा जाएगा)',
    'form.questionImage': 'प्रश्न की मुख्य तस्वीर (वैकल्पिक)',
    'form.uploadImage': 'तस्वीर अपलोड करें',
    'form.choosePreset': 'स्टिकर चुनें',
    'form.cropImage': 'क्रॉप व फ़िट करें',
    'form.answerType': 'उत्तर का प्रकार',
    'form.imageAnswers': 'चित्र उत्तर विकल्प',
    'form.addAnswer': 'नया चित्र विकल्प जोड़ें',
    'form.answerText': 'विकल्प का नाम / टेक्स्ट',
    'form.questionImages': 'तुलना के चित्र',
    'form.answerIcons': 'सही और गलत के आइकन',
    'form.image1': 'पहला चित्र (जैसे अच्छी आदत)',
    'form.image2': 'दूसरा चित्र (जैसे अनुचित आदत)',
    'form.rightIcon': 'सही (टिक) का निशान',
    'form.wrongIcon': 'गलत (क्रॉस) का निशान',
    'form.addBothImages': 'कृपया दोनों तुलनात्मक चित्र जोड़ें',
    'form.addAllRightWrongImages': 'कृपया दोनों चित्र और आइकन जोड़ें',
    'form.save': 'प्रश्न सहेजें',
    'form.cancel': 'रद्द करें',
    'form.saving': 'सहेजा जा रहा है...',
    'form.enterQuestion': 'कृपया प्रश्न वाक्य दर्ज करें',
    'form.addImageAnswers': 'कृपया कम से कम एक चित्र विकल्प जोड़ें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('picksy_language');
      if (saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return 'hi'; // Default to Hindi as in original app
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('picksy_language', lang);
    } catch {}
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const fallbackDict = translations.en;
    return fallbackDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
