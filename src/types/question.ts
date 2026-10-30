export type AnswerType = 'yesno' | 'images' | 'rightwrong';
export type QuestionCategory = 'M' | 'E' | 'N' | string;

export interface ImageAnswer {
  id: string;
  image: string;
  text: string;
}

export interface RightWrongImages {
  image1: string;
  image2: string;
  rightIcon?: string;
  wrongIcon?: string;
  correctOption?: 'image1' | 'image2' | 'both';
}

export interface Question {
  id: string;
  text: string;
  textHi?: string;
  image?: string;
  answerType: AnswerType;
  imageAnswers?: ImageAnswer[];
  rightWrongImages?: RightWrongImages;
  category: QuestionCategory;
  createdAt?: number;
  order?: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  speechRate: number; // 0.6 - 1.4
  speechPitch: number; // 0.8 - 1.4
  preferredVoice?: string;
  autoSpeak: boolean;
  confettiEnabled: boolean;
  theme: 'vibrant' | 'candy' | 'sunset' | 'ocean' | 'dark';
}
