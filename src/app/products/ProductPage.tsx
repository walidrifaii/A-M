"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { HeartIcon, CreditCard } from "lucide-react";
import { useGetProductsQuery, type Product as ApiProduct } from "../store/api/productsApi";
import { useStore } from "../store/StoreContext";
import QuickAddModal, { QuickProduct } from "../components/products/QuickAddDrawer";


export type Product = {
  id: string;
  _id?: string;
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
  const { addToCart, addFavorite, favorites, setBuyNowItem, removeFavItem } = useStore();
  const router = useRouter();

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
    data?.map((p: ApiProduct & { id?: string }) => {
      const rawId = p._id ?? p.id;
      const id = rawId != null ? String(rawId).trim() : "";
      return {
      id,
      _id: id || undefined,
      slug: (p.name || "").toLowerCase().replace(/\s+/g, "-"),
      name: p.name,
      price: `$${(p.price || 0).toFixed(2)}`,
      shortDescription: p.description,
      image: p.image,
      sizes: Array.isArray(p.size) ? p.size : [p.size],
    };
    }) ?? [];

  // ❤️ Toggle favorite
  const toggleFavorite = (product: Product) => {
    const alreadyFav = favorites.some((f) => f.id === product.id);
    if (alreadyFav) {
      removeFavItem(product.id);
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
    _id?: string;
    slug: string;
    name: string;
    price: string;
    image: string;
    sizes?: string[];
    shortDescription: string;
  }) => {
    setActiveProduct({
      id: p.id,
      _id: p._id,
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

  const handleBuyNow = (product: QuickProduct, size: string, qty: number) => {
    setBuyNowItem({
      ...product,
      sizes: [size],
      selectedSize: size,
      qty,
      image: typeof product.image === "string" ? product.image : product.image.src ?? "",
    });
    setModalOpen(false);
    router.push("/checkout?source=buy_now");
  };

  return (
    <div className="pb-12">
      {/* 🟢 Filter Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {["all", "men", "women"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "all" | "men" | "women")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === type
              ? "bg-[#445f21]  text-white"
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
                <div className="rounded-3xl p-3 shadow-md">
                  <Link
                    href={`/product/${p.id}`}
                    className="relative mx-auto block aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl"
                  >
                    {p.image && p.image.trim() !== "" ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                        priority={idx < 3}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-16 w-16 text-neutral-400 dark:text-neutral-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-lg bg-[#385119]/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                      {p.price}
                    </span>
                  </Link>

                  {/* ❤️ Button */}
                  <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                    <button
                      className={`pointer-events-auto rounded-lg p-2 shadow-sm transition ${wished
                        ? "bg-red-500 text-white"
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
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                      <span className="bg-gradient-to-r from-[#445f21] to-[#385119] bg-clip-text text-transparent">
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

                  <button
                    onClick={() => openQuickAdd(p)}
                    className="flex-1 flex items-center justify-center gap-3 text-[16px] w-full mt-2
                                     font-bold py-2 px-8 rounded-xl bg-[#445f21] text-white
                                       transition-all hover:bg-[#385119] hover:-translate-y-1 active:scale-95 "
                  >
                    <CreditCard className="h-5 w-5 stroke-[2.5]" />
                    Buy Now
                  </button>
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
        onConfirmBuy={handleBuyNow}
      />
    </div>
  );
}
