//src/state/api/questionsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { QuestionType } from "../../types/enums/QuestionType.enum";
import { GptModel } from "../../types/types/GptModel.type";
import { Question } from "../../types";
import {
  setGeneratedQuestionsTotalPages,
  setHistoryQuestionsTotalPages,
} from "../slices";
import { QuestionStatus } from "../../types/types/QuestionStatus.type";

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
        url: `/questions/history/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Questions", id }],
    }),

    updateQuestion: builder.mutation<Question, Question>({
      query: (body) => ({
        url: `/questions/history/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Questions", id }],
    }),

    getOneGeneratedQuestion: builder.query<
      {
        message: string;
        responseObject: Question;
      },
      string
    >({
      query: (id) => ({
        url: `/questions/generated/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "GeneratedQuestions", id },
      ],
    }),

    updateGeneratedQuestion: builder.mutation<Question, Question>({
      query: (body) => ({
        url: `/questions/generated/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "GeneratedQuestions", id },
      ],
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
        url: `/questions/history/translate/${questionId}`,
        method: "POST",
        body: { language },
      }),
    }),

    translateGeneratedQuestion: builder.mutation<
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
        url: `/questions/generated/translate/${questionId}`,
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
        difficulty?: string;
        status?: QuestionStatus;
        localeIncluded?: string;
        localeExcluded?: string;
        category?: string;
        title?: string;
        type?: QuestionType;
      }
    >({
      query: ({ limit, page, ...filters }) => ({
        url: "/questions/history",
        params: { limit, page, ...filters },
      }),
      providesTags: ["Questions"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setHistoryQuestionsTotalPages(data.responseObject.totalPages)
          );
        } catch (error) {
          console.error("Failed to fetch totalPages:", error);
        }
      },
    }),

    confirmQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/history/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["Questions", "GeneratedQuestions"],
    }),

    rejectQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/history/${id}/reject`,
        method: "DELETE",
      }),
      invalidatesTags: ["GeneratedQuestions"],
    }),

    // 🔹 this endpoint for confirming many questions
    confirmQuestions: builder.mutation<Question[], string[]>({
      query: (ids) => ({
        url: `/questions/history/confirm`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["Questions", "GeneratedQuestions"],
    }),

    rejectQuestions: builder.mutation<Question[], string[]>({
      query: (ids) => ({
        url: `/questions/history/reject`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["GeneratedQuestions"],
    }),

    confirmGeneratedQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/generated/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["Questions", "GeneratedQuestions"],
    }),

    rejectGeneratedQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/generated/${id}/reject`,
        method: "DELETE",
      }),
      invalidatesTags: ["GeneratedQuestions"],
    }),
    confirmGeneratedQuestions: builder.mutation<Question[], string[]>({
      query: (ids) => ({
        url: `/questions/generated/confirm`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["Questions", "GeneratedQuestions"],
    }),

    rejectGeneratedQuestions: builder.mutation<Question[], string[]>({
      query: (ids) => ({
        url: `/questions/generated/reject`,
        method: "DELETE",
        body: { ids },
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
  useConfirmQuestionsMutation,
  useRejectQuestionsMutation,
  useConfirmGeneratedQuestionMutation,
  useRejectGeneratedQuestionMutation,
  useConfirmGeneratedQuestionsMutation,
  useRejectGeneratedQuestionsMutation,
  useGetOneQuestionQuery,
  useUpdateQuestionMutation,
  useTranslateQuestionMutation,
  useGetOneGeneratedQuestionQuery,
  useUpdateGeneratedQuestionMutation,
  useTranslateGeneratedQuestionMutation,
} = questionsApi;
