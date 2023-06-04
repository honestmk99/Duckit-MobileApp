import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Member } from "../types";
import { WhoAmIResponse } from "../Login/authStore";

interface PagedQuery {
  resultsPerPage: number;
  pageNumber: number;
}

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/member`,
    credentials: "include",
    prepareHeaders: (h) => {
      h.set("x-requested-with", "XMLHttpRequest");
      return h;
    },
  }),
  endpoints: (build) => ({
    getUser: build.query<Member, string | null>({
      query: (id) => ({
        url: id ? `/?id=${id}` : "/",
        method: "GET",
      }),
    }),
    listUsers: build.query<WhoAmIResponse[], PagedQuery>({
      query: (args) => ({
        url: `/list?pageNumber=${args.pageNumber}&resultsPerPage=${args.resultsPerPage}`,
        method: "GET",
      }),
    }),
  }),
});
