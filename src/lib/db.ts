import { Question } from '@/types/question';
import { SEED_QUESTIONS } from './seedData';

const DB_NAME = 'picksy_offline_db';
const DB_VERSION = 1;
const STORE_QUESTIONS = 'questions';
const STORE_SETTINGS = 'settings';

let dbInstance: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_QUESTIONS)) {
        const questionStore = db.createObjectStore(STORE_QUESTIONS, { keyPath: 'id' });
        questionStore.createIndex('category', 'category', { unique: false });
        questionStore.createIndex('order', 'order', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Get all questions from local IndexedDB. Seeds if empty.
 */
export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_QUESTIONS], 'readonly');
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.getAll();

      request.onsuccess = async () => {
        let results = request.result as Question[];
        if (!results || results.length === 0) {
          // Check localStorage legacy fallback
          const localSaved = localStorage.getItem('picksy_local_questions');
          if (localSaved) {
            try {
              results = JSON.parse(localSaved);
              await saveQuestions(results);
              return resolve(results);
            } catch {}
          }
          // Seed with default questions
          await saveQuestions(SEED_QUESTIONS);
          resolve(SEED_QUESTIONS);
        } else {
          // Sort by order or createdAt
          results.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          resolve(results);
        }
      };

      request.onerror = () => {
        console.warn('Failed to load questions from IndexedDB, falling back to seed');
        resolve(SEED_QUESTIONS);
      };
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, falling back to memory/seed:', err);
    return SEED_QUESTIONS;
  }
};

/**
 * Save or update a single question
 */
export const saveQuestion = async (question: Question): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_QUESTIONS], 'readwrite');
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.put({
        ...question,
        createdAt: question.createdAt || Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // Fallback save in localStorage
    const questions = await getAllQuestions();
    const index = questions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      questions[index] = question;
    } else {
      questions.push(question);
    }
    localStorage.setItem('picksy_local_questions', JSON.stringify(questions));
  }
};

/**
 * Bulk save questions
 */
export const saveQuestions = async (questions: Question[]): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_QUESTIONS], 'readwrite');
      const store = transaction.objectStore(STORE_QUESTIONS);

      questions.forEach((q) => {
        store.put(q);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    localStorage.setItem('picksy_local_questions', JSON.stringify(questions));
  }
};

/**
 * Delete a question by ID
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_QUESTIONS], 'readwrite');
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    const questions = (await getAllQuestions()).filter((q) => q.id !== id);
    localStorage.setItem('picksy_local_questions', JSON.stringify(questions));
  }
};

/**
 * Reset local questions to default starter pack
 */
export const resetToDefaults = async (): Promise<Question[]> => {
  try {
    const db = await initDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_QUESTIONS], 'readwrite');
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    await saveQuestions(SEED_QUESTIONS);
    localStorage.removeItem('picksy_local_questions');
    return SEED_QUESTIONS;
  } catch (err) {
    localStorage.setItem('picksy_local_questions', JSON.stringify(SEED_QUESTIONS));
    return SEED_QUESTIONS;
  }
};

/**
 * Export all data to JSON string for backup/sharing
 */
export const exportBackupData = async (): Promise<string> => {
  const questions = await getAllQuestions();
  const customCategories = JSON.parse(localStorage.getItem('custom-categories') || '[]');
  const payload = {
    appName: 'Qapp',
    version: '2.0-offline',
    exportedAt: new Date().toISOString(),
    customCategories,
    questions,
  };
  return JSON.stringify(payload, null, 2);
};

/**
 * Import questions and categories from JSON backup
 */
export const importBackupData = async (jsonString: string): Promise<number> => {
  const parsed = JSON.parse(jsonString);
  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error('Invalid backup format: missing questions list');
  }
  if (Array.isArray(parsed.customCategories)) {
    localStorage.setItem('custom-categories', JSON.stringify(parsed.customCategories));
  }
  await saveQuestions(parsed.questions);
  return parsed.questions.length;
};
