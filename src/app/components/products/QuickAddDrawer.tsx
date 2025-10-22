"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export type QuickProduct = {
  id: string;
  slug: string;
  name: string;
  price: string;                // e.g. "$17.99"
  compareAtPrice?: string;      // e.g. "$19.00"
  image: string | StaticImageData;
  sizes?: string[];             // e.g. ["50ml","100ml"]
  shortDescription?: string;    // brief line under title
  longDescription?: string;     // paragraph in modal
};

export default function QuickAddModal({
  open,
  onClose,
  product,
  onConfirmAdd,
}: {
  open: boolean;
  onClose: () => void;
  product: QuickProduct | null;
  onConfirmAdd?: (p: QuickProduct, size: string) => void;
}) {
  const sizes = product?.sizes?.length ? product.sizes : ["50ml", "100ml"];
  const [size, setSize] = useState(sizes[0]);

  // reset size on product change
  useEffect(() => {
    if (!product) return;
    setSize(product.sizes && product.sizes.length ? product.sizes[0] : "50ml");
  }, [product]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <button
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[1px]"
          onClick={onClose}
          aria-label="Close quick add"
        />
      )}

      {/* Centered modal */}
      <div
        className={[
          "fixed inset-0 z-[81] flex items-center justify-center p-4",
          "transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          className={[
            "relative w-full max-w-[980px]",
            "bg-[var(--background)] text-[var(--foreground)]",
            "rounded-2xl shadow-2xl border border-neutral-200/70 dark:border-neutral-800",
            "transition-transform duration-300 transform-gpu",
            open ? "scale-100 translate-y-0" : "scale-95 translate-y-3",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Quick add to cart"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
              {/* Image */}
              <div className="relative rounded-2xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{product.name}</h2>

                {/* Price row */}
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-semibold text-rose-600">{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-base line-through opacity-60">
                      {product.compareAtPrice}
                    </span>
                  )}
                </div>

                {product.shortDescription && (
                  <p className="mt-2 text-sm text-black/80 dark:text-white/80">
                    {product.shortDescription}
                  </p>
                )}

                {/* Size selector */}
                <div className="mt-6">
                  <div className="text-sm mb-2">Size:</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const active = s === size;
                      return (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={[
                            "rounded-xl px-4 py-2 text-sm border transition",
                            active
                              ? "border-black dark:border-white"
                              : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500",
                          ].join(" ")}
                          aria-pressed={active}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Long description (fake data / notes) */}
                {product.longDescription && (
                  <div className="mt-6">
                    <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
                      {product.longDescription}
                    </p>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    className="w-full rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold py-3 tracking-wide"
                    onClick={() => product && onConfirmAdd?.(product, size)}
                  >
                    ADD TO CART →
                  </button>
                  <button className="w-full rounded-2xl bg-[#fde9a6] text-black font-semibold py-3 tracking-wide">
                    BUY IT NOW
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-sm underline inline-block"
                    onClick={onClose}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
