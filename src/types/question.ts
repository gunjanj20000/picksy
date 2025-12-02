export type AnswerType = 'yesno' | 'images';

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
}
