"use client";

import Link from "next/link";
import logo from "../../../assets/logo.png"
import Image from "next/image";

export default function IntroLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]">
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="animate-splash-logo">
          <Image src={logo} alt="Logo" width={500} height={500} priority className="object-contain" />
        </div>

    
      </div>
    </div>
  );
}
