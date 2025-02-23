// types.ts

import { GptModel } from "../../../types/GptModel.type";
import { QuestionType } from "../../../types/QuestionType.enum";

export interface Question {
  id: string;
  question: string;
  correct: string;
  wrong: string[];
}

export interface GenerateQuestionSettings {
  category: string;
  prompt: string;
  max_tokens: number;
  count: number;
  questions: Question[];
  temperature: number;
  tokensUsed: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: QuestionType;
  model: GptModel;
  error: string | null;
  requiredLanguages: string[];
  isGenerated: boolean;
}

export type Action =
  | {
      type: "SET_VALUE";
      field: keyof GenerateQuestionSettings;
      value: string | number | string[];
    }
  | { type: "SET_QUESTIONS"; questions: Question[] }
  | { type: "SET_TOKENS_USED"; tokensUsed: number }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_PROMPT" }
  | { type: "SET_IS_GENERATED"; isGenerated: boolean };
