import { admin_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: `${admin_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getJournals: builder.query({
      query: () => ({
        url: `${admin_url}/get-journals`,
        method: "GET",
        credentials: "include",
      }),
    }),

    removeJournal: builder.mutation({
      query: (id) => ({
        url: `${admin_url}/remove-journal/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${admin_url}/get-users`,
        method: "GET",
        credentials: "include",
      }),
    }),

    banUser: builder.mutation({
      query: (id) => ({
        url: `${admin_url}/ban-user/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: `${admin_url}/add-user`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    getGroups: builder.query({
      query: () => ({
        url: `${admin_url}/get-groups`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getSettlements: builder.query({
      query: () => ({
        url: `${admin_url}/get-settlements`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetJournalsQuery,
  useAddUserMutation,
  useBanUserMutation,
  useGetGroupsQuery,
  useGetSettlementsQuery,
  useGetDashboardDataMutation,
  useRemoveJournalMutation,
} = adminApiSlice;
