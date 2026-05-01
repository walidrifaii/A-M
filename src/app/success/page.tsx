"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6">
      <div className="max-w-md w-full bg-[var(--background)] border border-neutral-200/70 dark:border-white/10 rounded-3xl shadow-lg p-10 text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-[var(--foreground)]/80 mb-6">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>

        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Go to Shop
        </Link>
      </div>
    </div>
  );
}
