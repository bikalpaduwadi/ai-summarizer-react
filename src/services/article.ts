import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rapidApiKey = import.meta.env.VITE_RPIDAPI_KEY;

// const options = {
//   method: 'GET',
//   url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
//   params: {
//     url: 'https://time.com/6266679/musk-ai-open-letter/',
//     length: '3',
//   },
//   headers: {
//     'content-type': 'application/octet-stream',
//     'X-RapidAPI-Key': '4363af970fmsh328cbc931f65cc5p109bc1jsn8829d65b00cb',
//     'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com',
//   },
// };

interface QueryParam {
  articleUrl: string;
  length: number;
}

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', rapidApiKey);
      headers.set(
        'X-RapidAPI-Host',
        'article-extractor-and-summarizer.p.rapidapi.com'
      );
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query<any, QueryParam>({
      query: (params: QueryParam) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=${
          params.length || 3
        }`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
