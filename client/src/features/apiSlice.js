import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const progressApi = createApi({
  reducerPath: 'progressApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://video-progress-tracker-backend-0nz6.onrender.com' }),
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
