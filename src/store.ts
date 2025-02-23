import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/authSlice";
import { authApi } from "./state/api/authApi";
import { questionsApi } from "./state/api/questionsApi";
import questionsReducer from "./state/questionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {}, // if you want to pass an argument to your thunk function
      },
    }).concat(authApi.middleware, questionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
