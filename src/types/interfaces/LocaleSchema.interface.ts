export interface ILocaleSchema {
  language: string;
  question: string;
  correct: string | number[];
  wrong: string[];
  isValid: boolean;
}
