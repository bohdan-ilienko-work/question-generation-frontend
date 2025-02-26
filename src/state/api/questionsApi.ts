//src/state/api/questionsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { QuestionType } from "../../types/QuestionType.enum";
import { GptModel } from "../../types/GptModel.type";
import { Question } from "../../types/Question.interface";
import { setGeneratedQuestionsTotalPages } from "../questionsSlice";

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
    getOneQuestion: builder.query<
      {
        message: string;
        responseObject: Question;
      },
      string
    >({
      query: (id) => ({
        url: `/questions/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Questions", id }],
    }),

    updateQuestion: builder.mutation<Question, Question>({
      query: (body) => ({
        url: `/questions/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Questions", id }],
    }),

    /** 🔹 Новый запрос на перевод вопроса */
    translateQuestion: builder.mutation<
      {
        message: string;
        responseObject: {
          question: string;
          correct: string;
          wrong: string[];
          billedCharacters: number;
        };
      },
      { questionId: string; language: string }
    >({
      query: ({ questionId, language }) => ({
        url: `/questions/translate/${questionId}`,
        method: "POST",
        body: { language },
      }),
    }),

    getQuestionsHistory: builder.query<
      {
        message: string;
        responseObject: {
          questions: Question[];
          totalPages: number;
        };
      },
      {
        limit: number;
        page: number;
      }
    >({
      query: ({ limit, page }) => ({
        url: "/questions",
        params: { limit, page },
      }),
      providesTags: ["Questions"],
    }),

    confirmQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["Questions", "GeneratedQuestions"],
    }),

    rejectQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/${id}/reject`,
        method: "DELETE",
      }),
      invalidatesTags: ["GeneratedQuestions"],
    }),

    getGeneratedQuestions: builder.query<
      {
        message: string;
        responseObject: {
          questions: Question[];
          totalPages: number;
        };
      },
      { limit: number; page?: number }
    >({
      query: ({ limit, page = 1 }) => ({
        url: "/questions/generated",
        params: { limit, page },
      }),
      providesTags: ["GeneratedQuestions"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setGeneratedQuestionsTotalPages(data.responseObject.totalPages)
          );
        } catch (error) {
          console.error("Failed to fetch totalPages:", error);
        }
      },
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
  useGetQuestionsHistoryQuery,
  useDeleteQuestionMutation,
  useGenerateQuestionMutation,
  useGetGeneratedQuestionsQuery,
  useConfirmQuestionMutation,
  useRejectQuestionMutation,
  useGetOneQuestionQuery,
  useUpdateQuestionMutation,
  useTranslateQuestionMutation,
} = questionsApi;
