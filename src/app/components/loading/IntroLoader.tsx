"use client";

import logo from "../../../assets/logo.png"
import Image from "next/image";

export default function IntroLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#445f21]">
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center gap-8 text-center px-6">
        <div className="animate-splash-logo">
          <Image
            src={logo}
            alt=""
            width={500}
            height={500}
            priority
            className="object-contain brightness-0 invert drop-shadow-[0_2px_24px_rgba(255,255,255,0.15)]"
          />
        </div>
        <div className="animate-fade-in-up delay-150 space-y-2">
          <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Recreate Perfume
          </p>
          <p className="text-sm font-medium tracking-[0.2em] text-white/75 uppercase">
            Luxury fragrances
          </p>
        </div>
      </div>
    </div>
  );
}
