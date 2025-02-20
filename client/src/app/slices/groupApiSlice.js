import {  group_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (data) => ({
        url: `${group_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    updateGroup: builder.mutation({
      query: (data) => ({
        url: `${group_url}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Gets all the journals of the user
    getGroup: builder.query({
      query: () => ({
        url: `${group_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteGroup: builder.mutation({
      query: (journalId) => ({
        url: `${group_url}/${journalId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getSingleGroup: builder.query({
      query: (id) => ({
        url: `${group_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useGetGroupQuery,
  useDeleteGroupMutation,
  useGetSingleGroupQuery,
} = groupApiSlice;
