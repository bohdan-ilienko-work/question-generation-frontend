import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface StatsFilters {
  deeplLogs: {
    limit: number;
    page: number;
    totalPages: number;
    startDate?: string;
    endDate?: string;
    minCharacters?: number;
    maxCharacters?: number;
    sourceLanguage?: string;
    targetLanguage?: string;
  };
  openAiLogs: {
    limit: number;
    page: number;
    totalPages: number;
  };
}

const initialState: StatsFilters = {
  deeplLogs: {
    limit: 5,
    page: 1,
    totalPages: 0,
  },
  openAiLogs: {
    limit: 5,
    page: 1,
    totalPages: 0,
  },
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setDeeplLogsLimit: (state, action: PayloadAction<number>) => {
      state.deeplLogs.limit = action.payload;
    },
    setDeeplLogsPage: (state, action: PayloadAction<number>) => {
      state.deeplLogs.page = action.payload;
    },
    setDeeplLogsTotalPages: (state, action: PayloadAction<number>) => {
      state.deeplLogs.totalPages = action.payload;
    },
    setDeeplLogsStartDate: (state, action: PayloadAction<string>) => {
      state.deeplLogs.startDate = action.payload;
    },
    setDeeplLogsEndDate: (state, action: PayloadAction<string>) => {
      state.deeplLogs.endDate = action.payload;
    },
    setDeeplLogsSourceLanguage: (state, action: PayloadAction<string>) => {
      state.deeplLogs.sourceLanguage = action.payload;
    },
    setDeeplLogsTargetLanguage: (state, action: PayloadAction<string>) => {
      state.deeplLogs.targetLanguage = action.payload;
    },
    setDeeplLogsMinCharacters: (state, action: PayloadAction<number>) => {
      state.deeplLogs.minCharacters = action.payload;
    },
    setDeeplLogsMaxCharacters: (state, action: PayloadAction<number>) => {
      state.deeplLogs.maxCharacters = action.payload;
    },
    setOpenAiLogsLimit: (state, action: PayloadAction<number>) => {
      state.openAiLogs.limit = action.payload;
    },
    setOpenAiLogsPage: (state, action: PayloadAction<number>) => {
      state.openAiLogs.page = action.payload;
    },
    setOpenAiLogsTotalPages: (state, action: PayloadAction<number>) => {
      state.openAiLogs.totalPages = action.payload;
    },
  },
});

export const {
  setDeeplLogsLimit,
  setDeeplLogsPage,
  setDeeplLogsTotalPages,
  setDeeplLogsStartDate,
  setDeeplLogsEndDate,
  setDeeplLogsSourceLanguage,
  setDeeplLogsTargetLanguage,
  setDeeplLogsMinCharacters,
  setDeeplLogsMaxCharacters,
  setOpenAiLogsLimit,
  setOpenAiLogsPage,
  setOpenAiLogsTotalPages,
} = statsSlice.actions;

export const useSelectDeeplLogsFilters = () => {
  return useSelector((state: RootState) => state.stats.deeplLogs);
};

export const useSelectOpenAiLogsFilters = () => {
  return useSelector((state: RootState) => state.stats.openAiLogs);
};

export default statsSlice.reducer;
