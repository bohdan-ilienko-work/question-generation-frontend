import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionsState {
  limit: number;
  page: number;
  total: number;
  //   questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  limit: 5,
  page: 1,
  total: 0,
  //   questions: [],
  loading: false,
  error: null,
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLimit, setPage, setTotal, setLoading } =
  questionsSlice.actions;
//   useGetGeneratedQuestionsQuery
export default questionsSlice.reducer;
