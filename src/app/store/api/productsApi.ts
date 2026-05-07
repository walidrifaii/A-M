// store/api/productsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface SizePrice {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  _id?: string; // Some APIs use _id
  name: string;
  description: string;
  quantity: number;
  image: string;
  sizePrices: SizePrice[];
  sex?: string;
  brand?: string;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://api-perfuim-production.up.railway.app",
    prepareHeaders: (headers) => {
      const token = Cookies.get("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { sex?: string; brand?: string; minPrice?: number; maxPrice?: number } | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.sex) query.append("sex", params.sex);
        if (params?.brand) query.append("brand", params.brand);
        if (params?.minPrice) query.append("minPrice", params.minPrice.toString());
        if (params?.maxPrice) query.append("maxPrice", params.maxPrice.toString());
        return `/user/products${query.toString() ? `?${query.toString()}` : ""}`;
      },
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/user/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
        // FormData automatically sets the correct Content-Type with boundary
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<Product, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation 
} = productsApi;
