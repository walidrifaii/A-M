// store/api/productsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string[];
  sex?: string;
  brand?: string;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api-perfuim.onrender.com/user" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // ✅ accept optional filter params
    getProducts: builder.query<Product[], { sex?: string; brand?: string; minPrice?: number; maxPrice?: number } | void>({
      query: (params) => {
        // build URL dynamically
        const query = new URLSearchParams();
        if (params?.sex) query.append("sex", params.sex);
        if (params?.brand) query.append("brand", params.brand);
        if (params?.minPrice) query.append("minPrice", params.minPrice.toString());
        if (params?.maxPrice) query.append("maxPrice", params.maxPrice.toString());
        return `/products${query.toString() ? `?${query.toString()}` : ""}`;
      },
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
