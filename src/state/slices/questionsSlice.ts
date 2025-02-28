import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { QuestionStatus, QuestionType } from "../../types";

interface QuestionsState {
  generatedQuestionsFilters: {
    limit: number;
    page: number;
    totalPages: number;
  };
  historyQuestionsFilters: {
    limit: number;
    page: number;
    totalPages: number;
    title?: string;
    difficulty?: string;
    status?: QuestionStatus;
    localeIncluded?: string;
    localeExcluded?: string;
    category?: string;
    type?: QuestionType;
  };
}

const initialState: QuestionsState = {
  generatedQuestionsFilters: {
    limit: 5,
    page: 1,
    totalPages: 0,
  },
  historyQuestionsFilters: {
    limit: 5,
    page: 1,
    totalPages: 0,
  },
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setGeneratedQuestionsLimit: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.limit = action.payload;
    },
    setGeneratedQuestionsPage: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.page = action.payload;
    },
    setGeneratedQuestionsTotalPages: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.totalPages = action.payload;
    },
    //#region History actions export
    setHistoryQuestionsLimit: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.limit = action.payload;
    },
    setHistoryQuestionsPage: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.page = action.payload;
    },
    setHistoryQuestionsTotalPages: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.totalPages = action.payload;
    },
    setHistoryQuestionsTitle: (state, action: PayloadAction<string>) => {
      state.historyQuestionsFilters.title = action.payload;
    },
    setHistoryQuestionsDifficulty: (state, action: PayloadAction<string>) => {
      state.historyQuestionsFilters.difficulty = action.payload;
    },
    setHistoryQuestionsStatus: (
      state,
      action: PayloadAction<QuestionStatus>
    ) => {
      state.historyQuestionsFilters.status = action.payload;
    },
    setHistoryQuestionsLocaleIncluded: (
      state,
      action: PayloadAction<string>
    ) => {
      state.historyQuestionsFilters.localeIncluded = action.payload;
    },
    setHistoryQuestionsLocaleExcluded: (
      state,
      action: PayloadAction<string>
    ) => {
      state.historyQuestionsFilters.localeExcluded = action.payload;
    },
    setHistoryQuestionsCategory: (state, action: PayloadAction<string>) => {
      state.historyQuestionsFilters.category = action.payload;
    },
    setHistoryQuestionsType: (state, action: PayloadAction<QuestionType>) => {
      state.historyQuestionsFilters.type = action.payload;
    },
    //#endregion
  },
});

// 🔹 Экспорт экшенов
export const {
  setGeneratedQuestionsLimit,
  setGeneratedQuestionsPage,
  setGeneratedQuestionsTotalPages,
  setHistoryQuestionsLimit,
  setHistoryQuestionsPage,
  setHistoryQuestionsTotalPages,
  setHistoryQuestionsTitle,
  setHistoryQuestionsDifficulty,
  setHistoryQuestionsStatus,
  setHistoryQuestionsLocaleIncluded,
  setHistoryQuestionsLocaleExcluded,
  setHistoryQuestionsCategory,
  setHistoryQuestionsType,
} = questionsSlice.actions;

// 🔹 Кастомный хук для получения `generatedQuestionsFilters`
export const useSelectGeneratedQuestionsFilters = () => {
  return useSelector(
    (state: RootState) => state.questions.generatedQuestionsFilters
  );
};

// 🔹 Кастомный хук для получения `historyQuestionsFilters`
export const useSelectHistoryQuestionsFilters = () => {
  return useSelector(
    (state: RootState) => state.questions.historyQuestionsFilters
  );
};

// 🔹 Экспорт редюсера
export default questionsSlice.reducer;
