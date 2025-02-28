import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authSlice, logout } from "../slices/authSlice";

interface AuthResponse {
  responseObject: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LoginRequest {
  username: string;
  password: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    const token = (
      getState() as {
        auth: { accessToken: string };
      }
    ).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const accessToken = localStorage.getItem("accessToken");

  // Check if args is an object
  const modifiedArgs =
    typeof args === "object" && args !== null
      ? {
          ...args,
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            ...args.headers,
          },
        }
      : args; // If not, just return the args as is

  let result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (
      api.getState() as {
        auth: { refreshToken: string };
      }
    ).auth.refreshToken;
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const tokens = refreshResult.data as {
        accessToken: string;
        refreshToken: string;
      };
      api.dispatch(authSlice.actions.setTokens(tokens));
      result = await baseQuery(modifiedArgs, api, extraOptions);
    } else {
      api.dispatch(authSlice.actions.logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, string>({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST",
        // body: { refreshToken },
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: (_, { dispatch }) => {
        dispatch(logout());
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } =
  authApi;
