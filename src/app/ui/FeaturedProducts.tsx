"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import  { QuickProduct } from "@/app/components/products/QuickAddDrawer";
import sampleImg from "@/assets/perfume-bottle-with-shadow-free-png.webp";
import sampleImg2 from "@/assets/vecteezy_ai-generated-elegant-bottle-of-perfume-png_34763805.png";
import QuickAddModal from "@/app/components/products/QuickAddDrawer";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  shortDescription?: string;
  longDescription?: string;
  image: string | StaticImageData;
  sizes?: string[];
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
      slug: "amber-no-1",
      name: "Amber No.1",
      price: "$17.99",
      compareAtPrice: "$19.00",
      shortDescription: "Warm amber wrapped in vanilla & oud.",
      longDescription:
        "A cozy, sophisticated blend built around resinous amber and soft vanilla, balanced with oud and musk. Perfect for day-to-night elegance.",
      image: sampleImg,
      sizes: ["50ml", "100ml"],
    },
    {
      id: "p2",
      slug: "citrus-bloom",
      name: "Citrus Bloom",
      price: "$29.00",
      shortDescription: "Sparkling citrus with a floral heart.",
      longDescription:
        "Bright bergamot and grapefruit open to a bouquet of white florals, settling into a clean, musky base. Fresh, uplifting, modern.",
      image: sampleImg2,
      sizes: ["50ml", "100ml"],
    },
    {
      id: "p3",
      slug: "velvet-rose",
      name: "Velvet Rose",
      price: "$39.00",
      shortDescription: "Damask rose, saffron, and musk.",
      longDescription:
        "Lush Damask rose is spiced with saffron and kissed by amber. A romantic, intimate aura that lingers softly on skin.",
      image: sampleImg,
      sizes: ["50ml", "100ml"],
    },
    {
      id: "p4",
      slug: "midnight-oud",
      name: "Midnight Oud",
      price: "$49.00",
      shortDescription: "Smoky oud with resin and labdanum.",
      longDescription:
        "Dark woods and smoky oud meet balsamic resins for a magnetic, evening-ready trail. Deep, atmospheric, confident.",
      image: sampleImg,
      sizes: ["50ml", "100ml"],
    },
  ],
}: FeaturedProductsProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Favorites and quick add modal state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<QuickProduct | null>(null);

  const toggleFavorite = (id: string) =>
    setFavorites((f) => ({ ...f, [id]: !f[id] }));

  useEffect(() => {
    const root = gridRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
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

  function openQuickAdd(p: Product) {
    setActiveProduct({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.image,
      sizes: p.sizes ?? ["50ml", "100ml"],
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
    });
    setModalOpen(true);
  }

  return (
    <section className="page-container py-12 sm:py-16">
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl text-black dark:text-white">
        {title}
      </h2>

      <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, idx) => {
          const wished = !!favorites[p.id];

          return (
            <article
              key={p.id}
              data-reveal
              className="reveal group relative rounded-3xl transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${Math.min(idx * 100, 400)}ms` }}
            >
              <div className="rounded-3xl p-3">
                {/* Image (click -> details) */}
                <Link
                  href={`/Product/${p.slug}`}
                  className="relative mx-auto block aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl"
                  aria-label={`${p.name} details`}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    priority={idx < 3}
                  />
                  {/* Price badge */}
                  <span className="absolute left-2 top-2 rounded-lg bg-yellow-500/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                    {p.price}
                  </span>
                </Link>

                {/* Top-right actions */}
                <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                  {/* Favorite */}
                  <button
                    className={`pointer-events-auto rounded-lg p-2 shadow-sm transition ${
                      wished
                        ? "bg-rose-500 text-white"
                        : "bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                    aria-pressed={wished}
                    aria-label={wished ? "Remove from favorites" : "Add to favorites"}
                    title="Favorite"
                  >
                    <HeartIcon filled={wished} />
                  </button>

                  {/* Quick add (open modal) */}
                  <button
                    className="pointer-events-auto rounded-lg p-2 shadow-sm bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickAdd(p);
                    }}
                    aria-label="Quick add"
                    title="Quick add"
                  >
                    <CartIcon />
                  </button>
                </div>

                {/* Text */}
                <div className="mt-3">
                  <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                      {p.name}
                    </span>
                  </h3>
                  <p
                    className="mt-1.5 text-xs text-black/80 dark:text-white/80"
                    style={{ minHeight: 36, overflow: "hidden" }}
                  >
                    {p.shortDescription}
                  </p>
                </div>

                {/* Hover glow (keeps your design vibe but no forced card background) */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px 200px at 50% 0%, rgba(250,204,21,0.15), transparent 60%)",
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Quick Add Modal (centered) */}
      <QuickAddModal
        open={modalOpen}
        product={activeProduct}
        onClose={() => setModalOpen(false)}
        onConfirmAdd={(p, size) => {
          // TODO: wire to your cart store
          console.log("Add to cart:", p.slug, size);
          setModalOpen(false);
        }}
      />

      {/* Show more */}
      <div className="mt-8 w-full text-right">
        <Link
          href="/collection"
          className="inline-flex rounded-2xl border border-yellow-400/50 bg-yellow-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
        >
          Show more
        </Link>
      </div>
    </section>
  );
}

/* Tiny inline icons so you don't need extra imports */
function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={filled ? "fill-current" : ""}>
      <path
        fill="currentColor"
        d="M12 21s-6.716-4.434-9.066-7.226C.9 10.376 2.28 6.6 5.734 5.39A5.002 5.002 0 0 1 12 7a5.002 5.002 0 0 1 6.266-1.61c3.454 1.21 4.835 4.986 2.8 8.384C18.716 16.566 12 21 12 21z"
      />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="currentColor"
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1
        0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.41c.75 0 1.41-.41
        1.75-1.03l3.58-6.49A1 1 0 0 0 21 5H6.21l-.94-2H2v2h2l3.6 7.59L5.25 14.04c-.41.37-.66.9-.66
        1.48 0 1.1.9 1.98 2.01 1.98H19v-2H7.42c-.14 0-.25-.11-.25-.25 0-.09.04-.16.09-.21L7.16 14z"
      />
    </svg>
  );
}
