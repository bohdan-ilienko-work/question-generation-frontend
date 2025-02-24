import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionsState {
  limit: number;
  page: number;
  totalPages: number;
  //   loading: boolean;
  //   error: string | null;
}

const initialState: QuestionsState = {
  limit: 5,
  page: 1,
  totalPages: 0,
  //   loading: false,
  //   error: null,
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
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    // setLoading: (state, action: PayloadAction<boolean>) => {
    //   state.loading = action.payload;
    // },
  },
});

export const { setLimit, setPage, setTotalPages } = questionsSlice.actions;
export default questionsSlice.reducer;
