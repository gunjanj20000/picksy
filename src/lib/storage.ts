import { Question } from '@/types/question';
import {
  getAllQuestions,
  saveQuestion as dbSaveQuestion,
  deleteQuestion as dbDeleteQuestion,
  saveQuestions as dbSaveQuestions,
  resetToDefaults as dbResetToDefaults,
  exportBackupData,
  importBackupData,
} from './db';

// For local offline usage, images are kept directly as data URLs or SVGs in IndexedDB
export const uploadImage = async (base64Data: string, _fileName?: string): Promise<string> => {
  return base64Data;
};

// Get all questions from local offline database
export const getQuestions = async (): Promise<Question[]> => {
  return await getAllQuestions();
};

// Save a question locally
export const saveQuestion = async (question: Question): Promise<void> => {
  await dbSaveQuestion(question);
};

// Add a new question
export const addQuestion = async (question: Question): Promise<void> => {
  await dbSaveQuestion(question);
};

// Update an existing question
export const updateQuestion = async (id: string, updatedQuestion: Question): Promise<void> => {
  await dbSaveQuestion({ ...updatedQuestion, id });
};

// Delete a question
export const deleteQuestion = async (id: string): Promise<void> => {
  await dbDeleteQuestion(id);
};

// Bulk save
export const saveQuestions = async (questions: Question[]): Promise<void> => {
  await dbSaveQuestions(questions);
};

// Reset to seed starter pack
export const resetQuestions = async (): Promise<Question[]> => {
  return await dbResetToDefaults();
};

// Export to file download
export const exportQuestionsToFile = async () => {
  const jsonStr = await exportBackupData();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qapp-questions-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import from file
export const importQuestionsFromFile = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const count = await importBackupData(text);
        resolve(count);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
