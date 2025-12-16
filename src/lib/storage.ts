import { supabase } from '@/integrations/supabase/client';
import { Question, ImageAnswer } from '@/types/question';

// Rate limiting interface
interface RateLimiter {
  lastOperation: number;
  minInterval: number;
  operationsInLastMinute: number[];
  maxOperationsPerMinute: number;
}

// Rate limiting for uploads
const uploadRateLimit: RateLimiter = {
  lastOperation: 0,
  minInterval: 1000, // 1 second between uploads
  operationsInLastMinute: [],
  maxOperationsPerMinute: 20,
};

// Rate limiting for CRUD operations
const crudRateLimit: RateLimiter = {
  lastOperation: 0,
  minInterval: 500, // 500ms between operations
  operationsInLastMinute: [],
  maxOperationsPerMinute: 30,
};

const enforceRateLimit = async (limiter: typeof uploadRateLimit | typeof crudRateLimit): Promise<void> => {
  const now = Date.now();
  
  // Clean up old operations (older than 1 minute)
  limiter.operationsInLastMinute = limiter.operationsInLastMinute.filter(
    timestamp => now - timestamp < 60000
  );
  
  // Check if we've exceeded operations per minute
  if (limiter.operationsInLastMinute.length >= limiter.maxOperationsPerMinute) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
  }
  
  // Enforce minimum interval between operations
  const timeSinceLastOp = now - limiter.lastOperation;
  if (timeSinceLastOp < limiter.minInterval) {
    await new Promise(resolve => 
      setTimeout(resolve, limiter.minInterval - timeSinceLastOp)
    );
  }
  
  // Record this operation
  limiter.lastOperation = Date.now();
  limiter.operationsInLastMinute.push(Date.now());
};

// Upload image to Supabase Storage and return public URL
export const uploadImage = async (base64Data: string, fileName: string): Promise<string> => {
  // If it's already a URL (not base64), return as-is
  if (base64Data.startsWith('http')) {
    return base64Data;
  }
  
  // If empty, return empty
  if (!base64Data) {
    return '';
  }

  // Enforce rate limit for uploads
  await enforceRateLimit(uploadRateLimit);

  // Convert base64 to blob
  const base64Response = await fetch(base64Data);
  const blob = await base64Response.blob();
  
  // Check file size (max 5MB)
  if (blob.size > 5 * 1024 * 1024) {
    throw new Error('Image file size must be less than 5MB');
  }
  
  const filePath = `${Date.now()}-${fileName}`;
  
  const { error } = await supabase.storage
    .from('question-images')
    .upload(filePath, blob, {
      contentType: blob.type,
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('question-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Convert DB row to Question type
const rowToQuestion = (row: any): Question => ({
  id: row.id,
  text: row.text,
  image: row.image || undefined,
  answerType: row.answer_type as 'yesno' | 'images',
  imageAnswers: row.image_answers as ImageAnswer[] || undefined,
  category: row.category || 'M',
});

// Get all questions from Supabase
export const getQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return (data || []).map(rowToQuestion);
};

// Save question (create or update)
export const saveQuestion = async (question: Question): Promise<void> => {
  // Enforce rate limit for CRUD operations
  await enforceRateLimit(crudRateLimit);
  
  // Validate text length (matches DB constraint)
  if (question.text.length > 1000) {
    throw new Error('Question text must be 1000 characters or less');
  }
  
  if (question.text.trim() === '') {
    throw new Error('Question text cannot be empty');
  }
  
  // Validate category length
  if (question.category && question.category.length > 50) {
    throw new Error('Category must be 50 characters or less');
  }
  
  // Validate image answers for "images" type
  if (question.answerType === 'images') {
    if (!question.imageAnswers || question.imageAnswers.length === 0) {
      throw new Error('At least one image answer is required');
    }
    if (question.imageAnswers.length > 20) {
      throw new Error('Maximum 20 image answers allowed');
    }
  }

  // Upload images if they're base64
  let imageUrl = question.image || null;
  if (question.image && question.image.startsWith('data:')) {
    imageUrl = await uploadImage(question.image, `question-${question.id}`);
  }

  let imageAnswers = question.imageAnswers || [];
  if (imageAnswers.length > 0) {
    imageAnswers = await Promise.all(
      imageAnswers.map(async (answer) => {
        if (answer.image && answer.image.startsWith('data:')) {
          const uploadedUrl = await uploadImage(answer.image, `answer-${answer.id}`);
          return { ...answer, image: uploadedUrl };
        }
        return answer;
      })
    );
  }

  const { error } = await supabase
    .from('questions')
    .upsert(
      {
        id: question.id,
        text: question.text,
        image: imageUrl,
        answer_type: question.answerType,
        image_answers: imageAnswers as any,
        category: question.category,
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Error saving question:', error);
    // Provide user-friendly error messages
    if (error.message.includes('new row violates row-level security')) {
      throw new Error('Permission denied. You must be logged in as an admin to save questions.');
    }
    throw error;
  }
};

// Add a new question
export const addQuestion = async (question: Question): Promise<void> => {
  await saveQuestion(question);
};

// Update an existing question
export const updateQuestion = async (id: string, updatedQuestion: Question): Promise<void> => {
  await saveQuestion({ ...updatedQuestion, id });
};

// Delete a question
export const deleteQuestion = async (id: string): Promise<void> => {
  // Enforce rate limit for CRUD operations
  await enforceRateLimit(crudRateLimit);
  
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting question:', error);
    // Provide user-friendly error messages
    if (error.message.includes('new row violates row-level security')) {
      throw new Error('Permission denied. You must be logged in as an admin to delete questions.');
    }
    throw error;
  }
};

// Legacy sync functions - keep for backwards compatibility
export const saveQuestions = async (questions: Question[]): Promise<void> => {
  // Limit batch size to prevent abuse
  if (questions.length > 50) {
    throw new Error('Maximum 50 questions can be saved at once');
  }
  
  for (const question of questions) {
    await saveQuestion(question);
  }
};
