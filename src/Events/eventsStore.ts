import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Event, NewOf } from "../types";
import dayjs from "dayjs";

interface PagedQuery {
  resultsPerPage: number;
  pageNumber: number;
}

export interface GetNearQuery {
  latitude: number;
  longitude: number;
}

const EventTag = "event";
export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/event`,
    credentials: "include",
    prepareHeaders: (h) => {
      h.set("x-requested-with", "XMLHttpRequest");
      return h;
    },
  }),
  tagTypes: [EventTag],
  endpoints: (build) => ({
    getOne: build.query<Event, string>({
      query: (id) => ({
        url: `/one/${id}`,
        method: "GET",
      }),
    }),
    list: build.query<Event[], PagedQuery>({
      query: (args) => ({
        url: `/all?pageNumber=${args.pageNumber}&resultsPerPage=${args.resultsPerPage}`,
        method: "GET",
      }),
      transformResponse: (response: Event[]) =>
        response.map((e) => ({
          ...e,
          date: dayjs(e.date),
        })),
      providesTags: [EventTag],
    }),
    add: build.mutation<void, NewOf<Event>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [EventTag],
    }),
    update: build.mutation<void, NewOf<Event>>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      invalidatesTags: [EventTag],
    }),
  }),
});
