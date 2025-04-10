import { journal_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const journalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createJournal: builder.mutation({
      query: (data) => ({
        url: `${journal_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    updateJournal: builder.mutation({
      query: (data) => ({
        url: `${journal_url}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Gets all the journals of the user
    getJournal: builder.query({
      query: () => ({
        url: `${journal_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Gets Public journals of the user
    getPublicJournal: builder.query({
      query: () => ({
        url: `${journal_url}/public-journal`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteJournal: builder.mutation({
      query: (journalId) => ({
        url: `${journal_url}/${journalId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getSingleJournal: builder.query({
      query: (id) => ({
        url: `${journal_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useGetJournalQuery,
  useDeleteJournalMutation,
  useGetSingleJournalQuery,
  useGetPublicJournalQuery,
} = journalApiSlice;
