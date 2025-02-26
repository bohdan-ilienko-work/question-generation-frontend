import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  };
  // limit: number;
  // page: number;
  // totalPages: number;
  //   loading: boolean;
  //   error: string | null;
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
  // limit: 5,
  // page: 1,
  // totalPages: 0,
  //   loading: false,
  //   error: null,
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    // setLimit: (state, action: PayloadAction<number>) => {
    //   state.limit = action.payload;
    // },
    // setPage: (state, action: PayloadAction<number>) => {
    //   state.page = action.payload;
    // },
    // setTotalPages: (state, action: PayloadAction<number>) => {
    //   state.totalPages = action.payload;
    // },
    // setLoading: (state, action: PayloadAction<boolean>) => {
    //   state.loading = action.payload;
    // },
    setGeneratedQuestionsLimit: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.limit = action.payload;
    },
    setGeneratedQuestionsPage: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.page = action.payload;
    },
    setGeneratedQuestionsTotalPages: (state, action: PayloadAction<number>) => {
      state.generatedQuestionsFilters.totalPages = action.payload;
    },
    setHistoryQuestionsLimit: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.limit = action.payload;
    },
    setHistoryQuestionsPage: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.page = action.payload;
    },
    setHistoryQuestionsTotalPages: (state, action: PayloadAction<number>) => {
      state.historyQuestionsFilters.totalPages = action.payload;
    },
  },
});

// export const { setLimit, setPage, setTotalPages } = questionsSlice.actions;

export const {
  setGeneratedQuestionsLimit,
  setGeneratedQuestionsPage,
  setGeneratedQuestionsTotalPages,
  setHistoryQuestionsLimit,
  setHistoryQuestionsPage,
  setHistoryQuestionsTotalPages,
} = questionsSlice.actions;

export default questionsSlice.reducer;
