// store/api/checkoutApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

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
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api-perfuim-production.up.railway.app',
    prepareHeaders: (headers) => {
      const token = Cookies.get('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // User endpoints
    placeOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/user/checkout',
        method: 'POST',
        body,
      }),
    }),
    
    // Admin endpoints
    getOrders: builder.query<CheckoutResponse[], void>({
      query: () => '/admin/checkout',
      providesTags: ['Orders'],
    }),
    
    getOrderById: builder.query<CheckoutResponse, string>({
      query: (id) => `/admin/checkout/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
  }),
  tagTypes: ['Orders'],
});

export const { 
  usePlaceOrderMutation, 
  useGetOrdersQuery, 
  useGetOrderByIdQuery 
} = checkoutApi;
