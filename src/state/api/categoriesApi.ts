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
        categoryId: string;
      }
    >({
      query: ({ categoryId }) => ({
        url: `/categories/${categoryId}/clear-cache`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useSyncCategoriesMutation,
  useClearCategoryCacheMutation,
} = categoriesApi;
