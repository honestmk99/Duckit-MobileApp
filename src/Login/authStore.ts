import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Member } from "../types";

interface LoginRequest {
  email: string;
  password: string;
}

export interface WhoAmIResponse {
  roles: string[];
  profile: Member;
}

interface ChangeRolesRequest {
  memberId: string;
  roles: string[];
}

const UserTag = "User";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/auth`,
    credentials: "include",
    prepareHeaders: (h) => {
      h.set("x-requested-with", "XMLHttpRequest");
      return h;
    },
  }),
  tagTypes: [UserTag],
  endpoints: (build) => ({
    login: build.mutation<Member, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: [UserTag],
      transformResponse: (response: { data: Member }) => response.data,
    }),
    whoAmI: build.query<WhoAmIResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    changeRoles: build.mutation<void, ChangeRolesRequest>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
    }),
  }),
});
