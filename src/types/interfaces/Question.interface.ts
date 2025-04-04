import { ILocaleSchema } from "./LocaleSchema.interface";
import { QuestionStatus } from "../types";
import { QuestionType } from "../enums";

export interface Question {
  _id: string;
  // id: string;
  categoryId: string;
  status: QuestionStatus;
  track?: string;
  type: QuestionType;
  difficulty: number; // 1-5
  requiredLanguages: string[];
  audioId?: string;
  imageId?: string;
  authorId?: string;
  tags: string[];
  locales: ILocaleSchema[];
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
  source?: string;
}
