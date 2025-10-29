"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGetProductsQuery } from "../store/api/productsApi";
import QuickAddModal, { QuickProduct } from "../components/products/QuickAddDrawer";
import { useStore } from "../store/StoreContext";
import PageSkeleton from "../components/loading/PageSkeleton";

export type Product = {
id: string;
slug: string;
name: string;
price: string;
shortDescription?: string;
longDescription?: string;
image: string;
sizes?: string[];
};

interface FeaturedProductsProps {
title?: string;
}

export default function FeaturedProducts({ title = "Featured Perfumes" }: FeaturedProductsProps) {
const gridRef = useRef<HTMLDivElement | null>(null);
const [modalOpen, setModalOpen] = useState(false);
const [activeProduct, setActiveProduct] = useState<QuickProduct | null>(null);

// ✅ Use global store instead of local state
const { addToCart, addFavorite, favorites } = useStore();

const { data, isLoading } = useGetProductsQuery();
const products: Product[] =
data?.map((p) => ({
id: p._id,
slug: p.name.toLowerCase().replace(/\s+/g, "-"),
name: p.name,
price: `$${p.price.toFixed(2)}`,
shortDescription: p.description,
longDescription: p.description,
image: p.image,
sizes: [p.size],
})) ?? [];

// ✅ Use global favorite handler
const toggleFavorite = (product: Product) => {
  const alreadyFav = favorites.some((f) => f.id === product.id);
  if (alreadyFav) {
    addFavorite(product, "remove");
  } else {
    addFavorite({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      sizes: product.sizes,
    });
  }
};

const openQuickAdd = (p: Product) => {
setActiveProduct({
id: p.id,
slug: p.slug,
name: p.name,
price: p.price,
image: p.image,
sizes: p.sizes ?? ["50ml", "100ml"],
shortDescription: p.shortDescription,
longDescription: p.longDescription,
});
setModalOpen(true);
};

// ✅ Add to cart using global store
const handleAddToCart = (product: QuickProduct, size: string, qty: number) => {
  addToCart({
    ...product,
    // keep sizes if you need, but also pass the selected one explicitly
    sizes: [size],
    selectedSize: size,          // 👈 important for variant lines
    qty,                         // 👈 this is now respected by the store
    image:
      typeof product.image === "string"
        ? product.image
        : product.image.src ?? "",
  });
  setModalOpen(false);
};

if (isLoading) return <PageSkeleton rows={2} />;

return (
   <section className="page-container py-12 sm:py-16"> <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl text-black dark:text-white">{title}</h2>
  <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {products.map((p, idx) => {
      const wished = favorites.some((f) => f.id === p.id);
      return (
        <article
          key={p.id}
          data-reveal
          className="reveal group relative rounded-3xl transition-transform duration-300 hover:-translate-y-1"
          style={{ animationDelay: `${Math.min(idx * 100, 400)}ms` }}
        >
          <div className="rounded-3xl p-3">
            <Link
              href={`/product/${p.slug}`}
              className="relative mx-auto block aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                priority={idx < 3}
              />
              <span className="absolute left-2 top-2 rounded-lg bg-yellow-500/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                {p.price}
              </span>
            </Link>

            <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
              <button
                className={`pointer-events-auto rounded-lg p-2 shadow-sm transition ${wished ? "bg-rose-500 text-white" : "bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800"}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(p);
                }}
                aria-pressed={wished}
              >
                <HeartIcon filled={wished} />
              </button>

              <button
                className="pointer-events-auto rounded-lg p-2 shadow-sm bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickAdd(p);
                }}
              >
                <CartIcon />
              </button>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">{p.name}</span>
              </h3>
              <p className="mt-1.5 text-xs text-black/80 dark:text-white/80" style={{ minHeight: 36 }}>
                {p.shortDescription}
              </p>
            </div>
          </div>
        </article>
      );
    })}
  </div>

  <QuickAddModal
    open={modalOpen}
    product={activeProduct}
    onClose={() => setModalOpen(false)}
    onConfirmAdd={handleAddToCart}
  />
</section>


);
}

/* ---------- Icons ---------- */
function HeartIcon({ filled }: { filled?: boolean }) {
return (
<svg viewBox="0 0 24 24" width="16" height="16" className={filled ? "fill-current" : ""}> <path fill="currentColor" d="M12 21s-6.716-4.434-9.066-7.226C.9 10.376 2.28 6.6 5.734 5.39A5.002 5.002 0 0 1 12 7a5.002 5.002 0 0 1 6.266-1.61c3.454 1.21 4.835 4.986 2.8 8.384C18.716 16.566 12 21 12 21z"/> </svg>
);
}

function CartIcon() {
return ( <svg viewBox="0 0 24 24" width="16" height="16"> <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.41c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21 5H6.21l-.94-2H2v2h2l3.6 7.59L5.25 14.04c-.41.37-.66.9-.66 1.48 0 1.1.9 1.98 2.01 1.98H19v-2H7.42c-.14 0-.25-.11-.25-.25 0-.09.04-.16.09-.21L7.16 14z"/> </svg>
);
}
