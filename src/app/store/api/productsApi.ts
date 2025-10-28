// store/api/productsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api-perfuim.onrender.com/user' }), // your backend API
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      keepUnusedDataFor: 60, // cache for 60s
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

