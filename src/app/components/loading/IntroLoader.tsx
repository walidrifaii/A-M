"use client";

import Link from "next/link";

export default function IntroLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-[#f0b100]">
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center gap-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#f0b100] transition-transform hover:scale-105"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0b100] text-black shadow-lg">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
              <path fill="currentColor" d="M12 3l9 7-3 11H6L3 10l9-7z" />
            </svg>
          </span>
          <span className="text-2xl font-bold tracking-wide text-white">M&A</span>
        </Link>

        {/* Animated Lines */}
        <div className="flex flex-col items-center space-y-3">
          <div className="loader-line w-56" />
          <div className="loader-line w-72" />
          <div className="loader-line w-40" />
        </div>
      </div>
    </div>
  );
}
