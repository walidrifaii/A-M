"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import { useStore } from "../store/StoreContext";

// notes is required but can be empty string
interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  addressLine2?: string;
  notes: string;
}

// Yup schema with default for notes
const schema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email must have a valid TLD"),
  phone: yup.string().required("Phone is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string(),
  notes: yup.string().default(""),
}) as yup.ObjectSchema<CheckoutFormValues>;

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const { cart: cartItems, buyNowItem, clearCart, setBuyNowItem } = useStore();
  const [loading, setLoading] = useState(false);

  const displayItems = source === "buy_now" && buyNowItem ? [buyNowItem] : cartItems;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      addressLine2: "",
      notes: "",
    },
  });

  const subtotal = displayItems.reduce((sum, i) => {
    const p = i.price;
    const val = typeof p === "string" ? parseFloat(p.replace("$", "")) : Number(p);
    return sum + (isNaN(val) ? 0 : val) * (i.qty || 1);
  }, 0);
  const shipping = displayItems.length > 0 ? 4 : 0;
  const total = subtotal + shipping;
  const totalQty = displayItems.reduce((sum, i) => sum + (i.qty || 1), 0);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (displayItems.length === 0) {
      toast.error("Your checkout list is empty.");
      return;
    }

    const payload = {
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      addressLine1: data.address,
      addressLine2: data.addressLine2 || "",
      city: data.city,
      notes: data.notes,
      paymentMethod: "COD",
      items: displayItems.map((item) => ({
        productId: item.id,
        quantity: item.qty || 1,
        size: item.selectedSize || "Standard"
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
        if (source === "buy_now") {
          setBuyNowItem(null);
        } else {
          clearCart();
        }
        toast.success("Order placed successfully!");
        // window.location.href = "/success";
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
      <Navbar />

      <div className="mx-auto  px-4 sm:px-6 lg:px-32 py-12 lg:py-16
       grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
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
                  placeholder="Address Line 1"
                  {...register("address")}
                  className="border border-neutral-300/50 rounded-xl p-3 w-full bg-transparent focus:ring-1 focus:ring-[#827978]"
                  style={{ color: "var(--foreground)" }}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:col-span-2">
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  {...register("addressLine2")}
                  className="border border-neutral-300/50 rounded-xl p-3 w-full bg-transparent focus:ring-1 focus:ring-[#827978]"
                  style={{ color: "var(--foreground)" }}
                />
                {errors.addressLine2 && (
                  <p className="text-xs text-red-500 mt-1">{errors.addressLine2.message}</p>
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

              <div
                className="p-6 rounded-2xl shadow-sm border border-neutral-300/40 sm:col-span-2"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
              >
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <label className="flex items-center justify-between border border-[#827978] rounded-xl p-3 bg-transparent">
                  <span>Cash on Delivery</span>
                  <input type="radio" name="payment" value="cash" defaultChecked className="accent-[#827978]" />
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

          {displayItems.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {displayItems.map((item) => {
                  const p = item.price;
                  const priceNumber = typeof p === "string" ? parseFloat(p.replace("$", "")) : Number(p);
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
                          <p className="text-xs opacity-70">
                            {item.selectedSize && `${item.selectedSize} • `}
                            Qty {item.qty || 1}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">${(priceNumber * (item.qty || 1)).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <div className=" pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity</span>
                  <span>{totalQty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total Price</span>
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
              <Link
                href="/"
                className="inline-block bg-[#827978] hover:bg-[#6f6862] text-white font-semibold px-6 py-3 rounded-xl"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
