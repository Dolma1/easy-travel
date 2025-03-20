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

    inviteCode: builder.mutation({
      query: (groupId) => ({
        url: `${group_url}/invite-code/${groupId}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    verifyCode: builder.mutation({
      query: ({ joinCode }) => ({
        url: `${group_url}/verify-code/`,
        method: "POST",
        body: { joinCode },
        credentials: "include",
      }),
    }),
    joinGroup: builder.mutation({
      query: ({groupId}) => ({
        url: `${group_url}/join/`,
        method: "POST",
        body: {groupId},
        credentials: "include",
      }),
    }),
    // Gets all the group of the user
    getGroup: builder.query({
      query: () => ({
        url: `${group_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),

    addOrRemoveMembers: builder.mutation({
      query:({groupId,userId}) =>({
        url:`${group_url}/${groupId}`,
        body: {userId},
        method: "PUT",
        credentials:"include"
      })
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
  useInviteCodeMutation,
  useVerifyCodeMutation,
  useJoinGroupMutation,
  useAddOrRemoveMembersMutation
} = groupApiSlice;
