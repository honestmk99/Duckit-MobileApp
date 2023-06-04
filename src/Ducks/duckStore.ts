import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Duck, NewOf } from "../types";

interface PagedQuery {
  resultsPerPage: number;
  pageNumber: number;
}

interface GetDucksResponse {
  ducks: Duck[];
  totalDuckCount: number;
}

interface SearchRequest {
  name: string;
}

export interface RenameRequest {
  oldName: string;
  newName: string;
}

export interface RemoveRequest {
  name: string;
}

const DuckTag = "Duck";
export const duckApi = createApi({
  reducerPath: "duckApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/duck`,
    credentials: "include",
    prepareHeaders: (h) => {
      h.set("x-requested-with", "XMLHttpRequest");
      return h;
    },
  }),
  tagTypes: [DuckTag],
  endpoints: (build) => ({
    get: build.query<GetDucksResponse, PagedQuery>({
      query: (request) => ({
        url: `/?resultsPerPage=${request.resultsPerPage}&pageNumber=${
          request.pageNumber + 1
        }`,
        method: "GET",
      }),
      providesTags: [DuckTag],
    }),
    search: build.query<Duck[], SearchRequest>({
      query: (request) => ({
        url: `/search?name=${request.name}`,
        method: "GET",
      }),
      providesTags: [DuckTag],
    }),
    rename: build.mutation<void, RenameRequest>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      invalidatesTags: [DuckTag],
    }),
    remove: build.mutation<void, RemoveRequest>({
      query: (body) => ({
        url: "/",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [DuckTag],
    }),
    add: build.mutation<void, NewOf<Duck>[]>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [DuckTag],
    }),
  }),
});
