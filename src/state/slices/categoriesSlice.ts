import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface CategoriesFilters {
  limit: number;
  page: number;
  totalPages: number;
  title?: string;
}

const initialState: CategoriesFilters = {
  limit: 5,
  page: 1,
  totalPages: 0,
  title: "",
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setCategoriesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategoriesTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setCategoriesTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const {
  setCategoriesLimit,
  setCategoriesPage,
  setCategoriesTotalPages,
  setCategoriesTitle,
} = categoriesSlice.actions;

export const useCategoriesFilters = () => {
  return useSelector((state: RootState) => state.categories);
};

export default categoriesSlice.reducer;
