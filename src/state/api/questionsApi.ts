//src/state/api/questionsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { QuestionType } from "../../types/QuestionType.enum";
import { GptModel } from "../../types/GptModel.type";
import { Question } from "../../types/Question.interface";

export interface QuestionGenerate {
  prompt: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  max_tokens?: number;
  count: number;
  category: string;
  temperature: number;
  type: QuestionType;
  model: GptModel;
  requiredLanguages: string[];
}

export const questionsApi = createApi({
  reducerPath: "questionsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Questions", "GeneratedQuestions"],
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], void>({
      query: () => "/questions",
      providesTags: ["Questions"],
    }),
    getGeneratedQuestions: builder.query<
      Question[],
      { limit: number; page?: number }
    >({
      query: (limit, page = 1) => ({
        url: "/questions/generate",
        params: { limit, page },
      }),
      providesTags: ["GeneratedQuestions"],
    }),
    generateQuestion: builder.mutation<Question[], QuestionGenerate>({
      query: (body) => ({
        url: "/questions/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GeneratedQuestions"],
    }),
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useGenerateQuestionMutation,
  useGetGeneratedQuestionsQuery,
} = questionsApi;
