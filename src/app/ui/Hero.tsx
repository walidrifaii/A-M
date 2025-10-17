"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import perfumeImg from "@/assets/perfume-bottle-with-shadow-free-png.webp";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
}

export default function Hero({
  title = "Exquisite Perfumes, Timeless Impressions",
  subtitle = "Discover artisanal fragrances crafted with rare notes. Elevate your presence with scents that linger—elegant, modern, and unforgettable.",
  ctaPrimary = { label: "Shop Collection", href: "/#collection" },
  ctaSecondary = { label: "Explore Notes", href: "/#notes" },
  imageSrc = perfumeImg,
  imageAlt = "Perfume bottle",
}: HeroProps) {
  return (
    <section
      className="relative page-container flex flex-col items-center justify-center py-20 text-center sm:py-24"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]"
        style={{
          background:
            "radial-gradient(600px 600px at 50% 10%, rgba(250,204,21,0.15), transparent 60%), radial-gradient(600px 600px at 10% 80%, rgba(250,204,21,0.08), transparent 60%)",
        }}
      />

      {/* Image */}
      <div className="mb-8 animate-float sm:mb-10">
        <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
          {/* Falls back gracefully if the PNG is missing */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 256px, 192px"
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Text */}
      <h1 className="animate-fade-in-up text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="animate-fade-in-up delay-150 mx-auto mt-4 max-w-2xl text-base/7 text-foreground/80 sm:text-lg/8">
        {subtitle}
      </p>

      {/* CTAs */}
      <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={ctaPrimary.href}
          className="rounded-2xl border border-yellow-400/50 bg-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
        >
          {ctaPrimary.label}
        </Link>
        <Link
          href={ctaSecondary.href}
          className="rounded-2xl px-6 py-3 text-sm font-semibold transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          style={{ color: "var(--foreground)" }}
        >
          {ctaSecondary.label}
        </Link>
      </div>
    </section>
  );
}
