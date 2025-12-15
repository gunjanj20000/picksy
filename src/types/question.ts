export type AnswerType = 'yesno' | 'images';
export type QuestionCategory = 'M' | 'E' | 'N' | string;

export interface ImageAnswer {
  id: string;
  image: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  answerType: AnswerType;
  imageAnswers?: ImageAnswer[];
  category: QuestionCategory;
}
