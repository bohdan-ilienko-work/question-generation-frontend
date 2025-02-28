//src/state/api/statsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { DeeplLogStat } from "../../types";
import { setDeeplLogsTotalPages } from "../slices";

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DeeplLogStats", "OpenAiLogStats"],
  endpoints: (builder) => ({
    getDeeplLogs: builder.query<
      {
        message: string;
        responseObject: {
          logs: DeeplLogStat[];
          totalCharacters: number;
          totalPages: number;
          totalRequests: number;
        };
      },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/stats/deepl/logs",
        params: { page, limit },
      }),
      providesTags: (_result, _error, { page, limit }) => [
        { type: "DeeplLogStats", page, limit },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          dispatch(setDeeplLogsTotalPages(data.responseObject.totalPages));
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const { useGetDeeplLogsQuery } = statsApi;
