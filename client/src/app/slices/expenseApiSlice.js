import { expense_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (data) => ({
        url: `${expense_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    updateExpense: builder.mutation({
      query: (data) => ({
        url: `${expense_url}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Gets all the journals of the user
    getExpense: builder.query({
      query: () => ({
        url: `${expense_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteExpense: builder.mutation({
      query: (journalId) => ({
        url: `${expense_url}/${journalId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getSingleExpense: builder.query({
      query: (id) => ({
        url: `${expense_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useGetExpenseQuery,
  useDeleteJournalMutation,
  useGetSingleExpenseQuery
} = expenseApiSlice;
