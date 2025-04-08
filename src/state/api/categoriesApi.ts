//src/state/api/categoriesApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Category } from "../../types";
import { setCategoriesTotalPages } from "../slices";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<
      {
        message: string;
        responseObject: {
          categories: Category[];
          totalPages: number;
          categoriesCount: number;
        };
      },
      {
        page: number;
        limit: number;
        title?: string;
      }
    >({
      query: ({ page, limit, ...filters }) => ({
        url: "/categories",
        params: { page, limit, ...filters },
      }),
      providesTags: (_result, _error, { page, limit, ...filters }) => [
        { type: "Categories", page, limit, ...filters },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCategoriesTotalPages(data.responseObject.totalPages));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    getCategoryById: builder.query<
      {
        message: string;
        responseObject: Category;
      },
      {
        categoryId: number;
      }
    >({
      query: ({ categoryId }) => ({
        url: `/categories/${categoryId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { categoryId }) => [
        { type: "Categories", id: categoryId },
      ],
    }),
    syncCategories: builder.mutation<
      {
        message: string;
      },
      void
    >({
      query: () => ({
        url: "/categories/sync",
        method: "POST",
      }),
      invalidatesTags: ["Categories"],
    }),
    clearCategoryCache: builder.mutation<
      {
        message: string;
      },
      {
        categoryId: number;
      }
    >({
      query: ({ categoryId }) => ({
        url: `/categories/${categoryId}/clear-cache`,
        method: "DELETE",
      }),
    }),
    createCategory: builder.mutation<
      {
        message: string;
        responseObject: Category;
      },
      {
        name: string;
        parentId?: number;
        // ancestors?: string[];
        locales: { language: string; value: string }[];
      }
    >({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<
      {
        message: string;
      },
      {
        categoryId: string;
      }
    >({
      query: ({ categoryId }) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      {
        message: string;
        responseObject: Category;
      },
      {
        categoryId: number;
        name?: string;
        parentId?: string;
        ancestors?: string[];
        locales?: { language: string; value: string }[];
      }
    >({
      query: ({ categoryId, ...body }) => ({
        url: `/categories/${categoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    translateCategory: builder.mutation<
      {
        message: string;
        responseObject: { language: string; value: string }[];
      },
      {
        requiredLocales: string[];
        sourceLanguage: string;
        originalText: string;
      }
    >({
      query: (body) => ({
        url: "/categories/translate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useSyncCategoriesMutation,
  useClearCategoryCacheMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useTranslateCategoryMutation,
} = categoriesApi;
