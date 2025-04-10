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

    // updateExpense: builder.mutation({
    //   query: (data) => ({
    //     url: `${expense_url}/${data._id}`,
    //     method: "PUT",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // Gets all the expenses of the user
    getExpense: builder.query({
      query: () => ({
        url: `${expense_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // deleteExpense: builder.mutation({
    //   query: (journalId) => ({
    //     url: `${expense_url}/${journalId}`,
    //     method: "DELETE",
    //     credentials: "include",
    //   }),
    // }),

    getSingleExpense: builder.query({
      query: (expenseId) => ({
        url: `${expense_url}/${expenseId}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getExpenseSummary: builder.query({
      query: (id) => ({
        url: `${expense_url}/expense-summary/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    requestMoney: builder.mutation({
      query: (expenseId) => ({
        url: `${expense_url}/request-money/${expenseId}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    expenseSettlement: builder.mutation({
      query: (data) => ({
        url: `${expense_url}/settle-expense/${data.expenseId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    disputeExpense: builder.mutation({
      query: (data) => ({
        url: `${expense_url}/dispute-expense/${data.expenseId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    initiatePayment: builder.mutation({
      query: (data) => ({
        url: `${expense_url}/initiate-payment`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    completePayment: builder.mutation({
      query: ({pidx, expenseId}) => ({
        url: `${expense_url}/complete-payment?pidx=${pidx}`,
        method: "PUT",
        body: {expenseId},
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useExpenseSettlementMutation,
  useGetExpenseQuery,
  useGetExpenseSummaryQuery,
  useGetSingleExpenseQuery,
  useRequestMoneyMutation,
  useDisputeExpenseMutation,
  useInitiatePaymentMutation,
  useCompletePaymentMutation
} = expenseApiSlice;
