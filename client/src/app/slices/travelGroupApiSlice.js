import { travelGroup_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const travelGroupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTravelGroup: builder.mutation({
      query: (data) => ({
        url: `${travelGroup_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    
    updateJournal: builder.mutation({
      query: (data) => ({
        url: `${travelGroup_url}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Gets all the groups of the user
    getSingleTravelGroup: builder.query({
      query: (id) => ({
        url: `${travelGroup_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getTravelGroup: builder.query({
      query: () => ({
        url: `${travelGroup_url}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getTravelExpenses: builder.query({
      query: (id) => ({
        url: `${travelGroup_url}/all-expenses/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteJournal: builder.mutation({
      query: (journalId) => ({
        url: `${travelGroup_url}/${journalId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getSingleJournal: builder.query({
      query: (id) => ({
        url: `${travelGroup_url/id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateTravelGroupMutation,
  useUpdateJournalMutation,
  useGetTravelGroupQuery,
  useGetTravelExpensesQuery,
  useDeleteJournalMutation,
  useGetSingleJournalQuery,
  useGetSingleTravelGroupQuery
} = travelGroupApiSlice;
