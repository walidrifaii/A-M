"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProductsQuery,
  type Product as ApiProduct,
} from "../store/api/productsApi";
import QuickAddModal, {
  QuickProduct,
} from "../components/products/QuickAddDrawer";
import { useStore } from "../store/StoreContext";
import PageSkeleton from "../components/loading/PageSkeleton";
import { CreditCard } from "lucide-react";
import Image from "next/image";

export type Product = {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  price: string;
  sizePrices?: { size: string; price: number }[];
  shortDescription?: string;
  longDescription?: string;
  image: string;
  sizes?: string[];
};

interface FeaturedProductsProps {
  title?: string;
}

export default function FeaturedProducts({
  title = "Featured Perfumes",
}: FeaturedProductsProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<QuickProduct | null>(null);

  // ✅ Use global store instead of local state
  const { addToCart, addFavorite, favorites, setBuyNowItem } = useStore();
  const router = useRouter();

  const { data, isLoading } = useGetProductsQuery();
  const products: Product[] =
    data
      ?.map((p: ApiProduct & { id?: string }) => {
        const rawId = p._id ?? p.id;
        const id = rawId != null ? String(rawId).trim() : "";

        // Get the price of the first size or fallback
        const displayPrice =
          p.sizePrices && p.sizePrices.length > 0 ? p.sizePrices[0].price : 0;

        return {
          id,
          _id: id || undefined,
          slug: (p.name || "").toLowerCase().replace(/\s+/g, "-"),
          name: p.name,
          price: `$${displayPrice.toFixed(2)}`,
          sizePrices: p.sizePrices || [],
          shortDescription: p.description,
          longDescription: p.description,
          image: p.image,
          sizes: p.sizePrices?.map((sp) => sp.size) || [],
        };
      })
      .slice(-4)
      .reverse() ?? [];

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
      _id: p._id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      sizePrices: p.sizePrices,
      image: p.image,
      sizes: p.sizes ?? ["50ml", "100ml"],
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
    });
    setModalOpen(true);
  };

  const handleAddToCart = (
    product: QuickProduct,
    size: string,
    qty: number,
  ) => {
    addToCart({
      ...product,
      sizes: [size],
      selectedSize: size,
      qty,
      image:
        typeof product.image === "string"
          ? product.image
          : (product.image.src ?? ""),
    });
    setModalOpen(false);
  };

  const handleBuyNow = (product: QuickProduct, size: string, qty: number) => {
    setBuyNowItem({
      ...product,
      sizes: [size],
      selectedSize: size,
      qty,
      image:
        typeof product.image === "string"
          ? product.image
          : (product.image.src ?? ""),
    });
    setModalOpen(false);
    router.push("/checkout?source=buy_now");
  };

  if (isLoading) return <PageSkeleton rows={2} />;

  return (
    <section className=" py-12 sm:py-16">
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl ">
        {title}
      </h2>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((p, idx) => {
          const wished = favorites.some((f) => f.id === p.id);
          return (
            <article
              key={p.id}
              data-reveal
              className="reveal group relative rounded-3xl transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${Math.min(idx * 100, 400)}ms` }}
            >
              <div className="rounded-3xl p-3 shadow-md ">
                <Link
                  href={`/product/${p.id}`}
                  className="relative mx-auto block aspect-square w-full max-w-[240px]
                   overflow-hidden rounded-2xl  "
                >
                  {p.image &&
                  typeof p.image === "string" &&
                  p.image.trim() !== "" ? (
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

                <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                  <button
                    className={`pointer-events-auto rounded-lg p-2 shadow-sm transition ${wished ? "bg-red-500 text-white" : "bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white dark:hover:bg-neutral-800"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(p);
                    }}
                    aria-pressed={wished}
                  >
                    <HeartIcon filled={wished} />
                  </button>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold tracking-tight sm:text-base">
                    <span className="bg-gradient-to-r from-[#445f21] to-[#385119] bg-clip-text text-transparent">
                      {p.name}
                    </span>
                  </h3>
                  <p
                    className="mt-1.5 text-xs  text-[var(--foreground)]"
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

      <div className="flex justify-center py-4">
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-md font-semibold  bg-[#485e38] dark:text-white text-black px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700"
        >
          View All Products
          
        </Link>
      </div>
      <QuickAddModal
        open={modalOpen}
        product={activeProduct}
        onClose={() => setModalOpen(false)}
        onConfirmAdd={handleAddToCart}
        onConfirmBuy={handleBuyNow}
      />
    </section>
  );
}

/* ---------- Icons ---------- */
function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={filled ? "fill-current" : ""}
    >
      {" "}
      <path
        fill="currentColor"
        d="M12 21s-6.716-4.434-9.066-7.226C.9 10.376 2.28 6.6 5.734 5.39A5.002 5.002 0 0 1 12 7a5.002 5.002 0 0 1 6.266-1.61c3.454 1.21 4.835 4.986 2.8 8.384C18.716 16.566 12 21 12 21z"
      />{" "}
    </svg>
  );
}
