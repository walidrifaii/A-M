"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { useGetProductsQuery } from "../store/api/productsApi";
import { useStore } from "../store/StoreContext";
import QuickAddModal, { QuickProduct } from "../components/products/QuickAddDrawer";


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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const sexParam = searchParams.get("sex"); // read ?sex=men or ?sex=women
  const [filter, setFilter] = useState<"all" | "men" | "women" | "unisex">("all");
  const gridRef = useRef<HTMLDivElement | null>(null);

  // 🟡 Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<QuickProduct | null>(null);

  // 🛍️ Global store
  const { addToCart, addFavorite, favorites } = useStore();

  // 🟢 Sync URL param to filter
  useEffect(() => {
    if (sexParam === "men" || sexParam === "women" || sexParam === "unisex") {
      setFilter(sexParam);
    } else {
      setFilter("all");
    }
  }, [sexParam]);

  // 🟡 Fetch products
  const { data, isLoading } = useGetProductsQuery(
    filter === "all" ? undefined : { sex: filter }
  );

  const products =
    data?.map((p) => ({
      id: p._id,
      slug: p.name.toLowerCase().replace(/\s+/g, "-"),
      name: p.name,
      price: `$${p.price.toFixed(2)}`,
      shortDescription: p.description,
      image: p.image,
      sizes: Array.isArray(p.size) ? p.size : [p.size],
    })) ?? [];

  // ❤️ Toggle favorite
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

  // 🛒 Quick add modal
  const openQuickAdd = (p: { 
    id: string;
    slug: string;
    name: string;
    price: string;
    image: string;
    sizes?: string[];
    shortDescription: string;
  }) => {
    setActiveProduct({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.image,
      sizes: p.sizes ?? ["50ml", "100ml"],
      shortDescription: p.shortDescription,
    });
    setModalOpen(true);
  };

  // 🛒 Add to cart handler
  const handleAddToCart = (product: QuickProduct, size: string, qty: number) => {
    addToCart({
      ...product,
      sizes: [size],
      selectedSize: size,
      qty,
      image: typeof product.image === "string" ? product.image : product.image.src ?? "",
    });
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* 🟢 Filter Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {["all", "men", "women", "unisex"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "all" | "men" | "women" | "unisex")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === type
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 dark:bg-neutral-800 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700"
            }`}
          >
            {type === "all"
              ? "All"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* 🛍 Product Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No products found.
        </p>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((p, idx) => {
            const wished = favorites.some((f) => f.id === p.id);
            return (
              <article
                key={p.id}
                className="group relative rounded-3xl transition-transform duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${Math.min(idx * 100, 400)}ms` }}
              >
                <div className="rounded-3xl p-3">
                  <Link
                    href={`/product/${p.slug}`}
                    className="relative mx-auto block aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={p.image && p.image.trim() !== "" ? p.image : "/src/assets/placeholder.webp"}
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

                  {/* ❤️ + 🛒 Buttons */}
                  <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                    <button
                      className={`pointer-events-auto rounded-lg p-2 shadow-sm transition ${
                        wished
                          ? "bg-rose-500 text-white"
                          : "bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(p);
                      }}
                    >
                      <HeartIcon size={16} fill={wished ? "currentColor" : "none"} />
                    </button>

                    <button
                      className="pointer-events-auto rounded-lg p-2 shadow-sm bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openQuickAdd(p);
                      }}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                        {p.name}
                      </span>
                    </h3>
                    <p
                      className="mt-1.5 text-xs text-[var(--foreground)]"
                      style={{ minHeight: 36 }}
                    >
                      {p.shortDescription}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <QuickAddModal
        open={modalOpen}
        product={activeProduct}
        onClose={() => setModalOpen(false)}
        onConfirmAdd={handleAddToCart}
      />
    </div>
  );
}
