import { Question } from '@/types/question';

const STORAGE_KEY = 'learning_app_questions';

export const getQuestions = (): Question[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default questions
  return [
    {
      id: '1',
      text: 'क्या आपने ब्रश किया?',
      answerType: 'yesno',
    },
    {
      id: '2',
      text: 'आप नाश्ते में क्या खाओगे?',
      answerType: 'images',
      imageAnswers: [
        { id: '1', image: '', text: 'पोहा' },
        { id: '2', image: '', text: 'मैगी' },
        { id: '3', image: '', text: 'उपमा' },
      ],
    },
  ];
};

export const saveQuestions = (questions: Question[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

export const addQuestion = (question: Question) => {
  const questions = getQuestions();
  questions.push(question);
  saveQuestions(questions);
};

export const updateQuestion = (id: string, updatedQuestion: Question) => {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index !== -1) {
    questions[index] = updatedQuestion;
    saveQuestions(questions);
  }
};

export const deleteQuestion = (id: string) => {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  saveQuestions(filtered);
};
