import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/slices/authSlice";
import { authApi } from "./state/api/authApi";
import { questionsApi } from "./state/api/questionsApi";
import questionsReducer from "./state/slices/questionsSlice";
import statsReducer from "./state/slices/statsSlice";
import { categoriesApi } from "./state";
import categoriesReducer from "./state/slices/categoriesSlice";
import { statsApi } from "./state";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    stats: statsReducer,
    categories: categoriesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {}, // if you want to pass an argument to your thunk function
      },
    }).concat(
      authApi.middleware,
      questionsApi.middleware,
      statsApi.middleware,
      categoriesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
