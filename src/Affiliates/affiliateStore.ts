import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Affiliate } from "../types";

interface PagedQuery {
  resultsPerPage: number;
  pageNumber: number;
}

interface AffiliatesResponse {
  affiliates: Affiliate[];
  totalAffiliateCount: number;
}

export const affiliateApi = createApi({
  reducerPath: "affiliateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/affiliate`,
    credentials: "include",
    prepareHeaders: (h) => {
      h.set("x-requested-with", "XMLHttpRequest");
      return h;
    },
  }),
  endpoints: (build) => ({
    getAffiliate: build.query<Affiliate, string | null>({
      query: (id) => ({
        url: id ? `/?id=${id}` : "/",
        method: "GET",
      }),
    }),
    listAffiliates: build.query<AffiliatesResponse, PagedQuery>({
      query: (args) => ({
        url: `/?pageNumber=${args.pageNumber}&resultsPerPage=${args.resultsPerPage}`,
        method: "GET",
      }),
    }),
  }),
});
