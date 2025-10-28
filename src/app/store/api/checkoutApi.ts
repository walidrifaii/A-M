// store/api/checkoutApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  notes?: string;
  paymentMethod: string; // COD
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  city: string;
  notes: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    name: string;
    brand?: string;
    size?: string;
  }>;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api-perfuim.onrender.com/user' }),
  endpoints: (builder) => ({
    placeOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/checkout',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export const { usePlaceOrderMutation } = checkoutApi;
