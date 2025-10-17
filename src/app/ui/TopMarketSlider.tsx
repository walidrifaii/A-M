"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bottle from "@/assets/perfume-bottle-with-shadow-free-png.webp";

type Slide = {
  id: string;
  name: string;
  brand: string;
  image: string | StaticImageData;
};

interface TopMarketSliderProps {
  title?: string;
  logoSvg?: React.ReactNode;
  slides?: Slide[];
}

export default function TopMarketSlider({
  title = "Top Market Perfume",
  logoSvg = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d="M12 3l9 7-3 11H6L3 10l9-7z" />
    </svg>
  ),
  slides = [
    { id: "s1", name: "Amber No.1", brand: "Aurum", image: bottle },
    { id: "s2", name: "Citrus Bloom", brand: "Verde", image: bottle },
    { id: "s3", name: "Velvet Rose", brand: "Rosaria", image: bottle },
    { id: "s4", name: "Midnight Oud", brand: "Noctis", image: bottle },
    { id: "s5", name: "Sea Whisper", brand: "Maris", image: bottle },
    { id: "s6", name: "Spiced Noir", brand: "Nero", image: bottle },
  ],
}: TopMarketSliderProps) {
  return (
    <div className="w-full" style={{ color: "var(--foreground)" }}>
      <header className="mb-4 flex items-center gap-2 px-4 sm:px-6 lg:px-8">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
          {logoSvg}
        </span>
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h3>
      </header>

      <div className="relative overflow-hidden">
        {/* Horizontal Marquee */}
        <div className="marquee-horizontal whitespace-nowrap py-4">
          {[...slides, ...slides].map((s, idx) => (
            <div
              key={`${s.id}-${idx}`}
              className="mr-6 inline-flex items-center gap-6 px-6 py-4"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{s.name}</p>
                <p className="truncate text-sm text-foreground/70">{s.brand}</p>
              </div>
              <Link
                href="#"
                className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-yellow-600 hover:underline"
              >
                View
              </Link>
            </div>
          ))}
        </div>
        {/* No gradient fades for full-bleed look */}
      </div>
    </div>
  );
}
