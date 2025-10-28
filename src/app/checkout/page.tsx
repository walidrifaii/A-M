"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";

interface CartItem {
  id: string | number;
  name: string;
  price: string; // stored as "$29.99"
  qty: number;
  image: string;
}

interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

// Yup validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Email must have a valid TLD"
    ),
  phone: yup.string().required("Phone is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  notes: yup.string(),
});

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: yupResolver<CheckoutFormValues, object, CheckoutFormValues>(schema),
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, i) => {
    const priceNumber = Number(i.price.replace("$", ""));
    return sum + priceNumber * i.qty;
  }, 0);
  const shipping = cartItems.length > 0 ? 4 : 0;
  const total = subtotal + shipping;

  // Submit handler
  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const payload = {
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      addressLine1: data.address,
      addressLine2: "",
      city: data.city,
      notes: data.notes || "",
      paymentMethod: "COD",
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
    };

    try {
      setLoading(true);
      const res = await fetch("https://api-perfuim.onrender.com/user/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok) {
        localStorage.removeItem("cart");
        toast.success("Order placed successfully!");
        window.location.href = "/success";
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details */}
          <div
            className="p-6 rounded-2xl shadow-sm border border-neutral-300/40"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
          >
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {[ 
                { placeholder: "Full Name", name: "fullName" },
                { placeholder: "Email Address", name: "email" },
                { placeholder: "Phone Number", name: "phone" },
                { placeholder: "City", name: "city" },
              ].map((field, index) => (
                <div key={index} className="flex flex-col">
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    {...register(field.name as keyof CheckoutFormValues)}
                    className="border border-neutral-300/50 rounded-xl p-3 w-full bg-transparent focus:ring-1 focus:ring-[#827978]"
                    style={{ color: "var(--foreground)" }}
                  />
                  {errors[field.name as keyof CheckoutFormValues] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[field.name as keyof CheckoutFormValues]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-col sm:col-span-2">
                <input
                  type="text"
                  placeholder="Address Line"
                  {...register("address")}
                  className="border border-neutral-300/50 rounded-xl p-3 w-full bg-transparent focus:ring-1 focus:ring-[#827978]"
                  style={{ color: "var(--foreground)" }}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:col-span-2">
                <textarea
                  placeholder="Order Notes (optional)"
                  rows={3}
                  {...register("notes")}
                  className="border border-neutral-300/50 rounded-xl p-3 w-full bg-transparent focus:ring-1 focus:ring-[#827978]"
                  style={{ color: "var(--foreground)" }}
                />
                {errors.notes && (
                  <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div
                className="p-6 rounded-2xl shadow-sm border border-neutral-300/40 sm:col-span-2"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
              >
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <label className="flex items-center justify-between border border-[#827978] rounded-xl p-3 bg-transparent">
                  <span>Cash on Delivery</span>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    defaultChecked
                    className="accent-[#827978]"
                  />
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div
          className="lg:sticky lg:top-8 h-fit p-6 rounded-2xl shadow-sm border border-neutral-300/40"
          style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        >
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {cartItems.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const priceNumber = Number(item.price.replace("$", ""));
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-neutral-300/40 pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-200/60">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs opacity-70">Qty {item.qty}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">${(priceNumber * item.qty).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-300/40 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="mt-6 block w-full bg-[#827978] hover:bg-[#6f6862] text-white text-center font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </>
          ) : (
            <div className="text-center py-10">
                <p className="text-sm opacity-70">Your cart is empty.</p>
            </div>
          )}
        </div>  
        </div>
    </div>
    );
}