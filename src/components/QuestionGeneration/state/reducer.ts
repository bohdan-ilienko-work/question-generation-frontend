// reducer.ts
import { QuestionType } from "../../../types/enums/QuestionType.enum";
import { GenerateQuestionSettings, Action } from "./types";

export const initialState: GenerateQuestionSettings = {
  category: null,
  prompt: "",
  // max_tokens: 140,
  count: 5,
  questions: [],
  tokensUsed: 0,
  temperature: 0.5,
  difficulty: 3,
  type: QuestionType.OneChoice,
  model: "gpt-4o",
  requiredLanguages: ["en", "es", "fr", "de", "uk", "zh"],
  error: null,
  isGenerated: false,
};

export const reducer = (
  state: GenerateQuestionSettings,
  action: Action
): GenerateQuestionSettings => {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, [action.field]: action.value };
    case "SET_QUESTIONS":
      return { ...state, questions: action.questions, error: null };
    case "SET_TOKENS_USED":
      return { ...state, tokensUsed: action.tokensUsed };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "CLEAR_PROMPT":
      return { ...state, prompt: "" };
    case "SET_IS_GENERATED":
      return { ...state, isGenerated: action.isGenerated };
    default:
      return state;
  }
};
