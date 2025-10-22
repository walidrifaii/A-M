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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
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
    <section className="w-full py-10 sm:py-14" style={{ color: "var(--foreground)" }}>
      {/* Header */}
      <header className="mb-6 flex items-center gap-3 px-6 lg:px-12">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow-md">
          {logoSvg}
        </span>
        <h3 className="text-lg sm:text-2xl font-semibold tracking-tight">{title}</h3>
      </header>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        <div
          className="marquee-horizontal whitespace-nowrap py-6"
          style={{
            animation: "scroll-left 45s linear infinite",
          }}
        >
          {[...slides, ...slides].map((s, idx) => (
            <div
              key={`${s.id}-${idx}`}
              className="mr-8 inline-flex items-center gap-8 px-6 py-4 rounded-3xl bg-[var(--background)] shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Image — no background now */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl flex-shrink-0">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 120px, 20vw"
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold sm:text-xl">{s.name}</p>
                <p className="truncate text-sm sm:text-base text-black/70 dark:text-white/70">
                  {s.brand}
                </p>
              </div>

              {/* Button */}
              <Link
                href="#"
                className="inline-flex items-center rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes for marquee */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-horizontal {
          display: inline-flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
