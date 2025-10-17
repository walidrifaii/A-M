"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import sampleImg from "@/assets/perfume-bottle-with-shadow-free-png.webp";
import sampleImg2 from "@/assets/vecteezy_ai-generated-elegant-bottle-of-perfume-png_34763805.png";
// import sampleImg3 from "@/assets/perfume-bottle-with-shadow-free-png.webp";
// import sampleImg4 from "@/assets/perfume-bottle-with-shadow-free-png.webp";

export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string | StaticImageData;
};

interface FeaturedProductsProps {
  title?: string;
  products?: Product[];
}

export default function FeaturedProducts({
  title = "Featured Perfumes",
  products = [
    {
      id: "p1",
      name: "Amber No.1",
      price: "$129",
      description: "Warm amber, vanilla, and oud.",
      image: sampleImg,
    },
    {
      id: "p2",
      name: "Citrus Bloom",
      price: "$99",
      description: "Citrus zest with floral heart.",
      image: sampleImg2,
    },
    {
      id: "p3",
      name: "Velvet Rose",
      price: "$149",
      description: "Damask rose, saffron, musk.",
      image: sampleImg,
    },
    {
      id: "p4",
      name: "Midnight Oud",
      price: "$179",
      description: "Smoky oud and labdanum.",
      image: sampleImg,
    },
  ],
}: FeaturedProductsProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = gridRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="page-container py-12 sm:py-16"
      style={{ color: "var(--foreground)" }}
    >
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((p, idx) => (
          <article
            key={p.id}
            data-reveal
            className="reveal group relative rounded-3xl transition-transform duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${Math.min(idx * 100, 400)}ms`,
            }}
          >
            <div className="rounded-3xl p-3">
              {/* Image area (uniform) */}
              <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  priority={idx < 3}
                />
                {/* Price badge overlay */}
                <span className="absolute left-2 top-2 rounded-lg bg-yellow-500/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                  {p.price}
                </span>
              </div>

              {/* Text content */}
              <div className="mt-3">
                <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                    {p.name}
                  </span>
                </h3>
                <p
                  className="mt-1.5 text-xs text-foreground/80"
                  style={{ minHeight: 36, overflow: "hidden" }}
                >
                  {p.description}
                </p>
              </div>

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px 200px at 50% 0%, rgba(250,204,21,0.15), transparent 60%)",
                }}
              />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 w-full text-right">
        <button
          type="button"
          className="inline-flex rounded-2xl border border-yellow-400/50 bg-yellow-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
        >
          Show more
        </button>
      </div>
    </section>
  );
}
