import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const progressApi = createApi({
  reducerPath: 'progressApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    getProgress: builder.query({
      query: ({ userId, videoId }) => `progress/${userId}/${videoId}`,
    }),
    updateProgress: builder.mutation({
      query: (body) => ({
        url: 'progress/update',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProgressQuery,
  useUpdateProgressMutation,
} = progressApi;
