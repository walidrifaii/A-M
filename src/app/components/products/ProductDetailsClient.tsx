"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, useMemo } from "react";
import { Heart, Minus, Plus, Star, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import Navbar from "@/app/ui/NavBar";
import Footer from "@/app/ui/Footer";

// Types
type Variant = { id: string; label: string; inStock?: boolean };
type Media = { id: string; src: string | StaticImageData; alt?: string };

export interface ProductDetailsProps {
  title?: string;
  price?: string;
  rating?: number; // 0 - 5
  reviewsCount?: number;
  inStock?: boolean;
  description?: string;
  notes?: string[];
  shippingInfo?: string;
  variants?: Variant[];
  media?: Media[];
}

export default function ProductDetailsClient({
  title = "Amber No.1 — Eau de Parfum",
  price = "$129",
  rating = 4.6,
  reviewsCount = 128,
  inStock = true,
  description = "A warm, sophisticated blend of amber, vanilla, and rare resins. Crafted to linger beautifully and reveal new facets over time.",
  notes = ["Top: Bergamot, Saffron", "Heart: Amber, Rose", "Base: Vanilla, Oud, Musk"],
  shippingInfo = "Free shipping on orders over $100. 30-day returns. Duty included.",
  variants = [
    { id: "50", label: "50ml", inStock: true },
    { id: "100", label: "100ml", inStock: true },
    { id: "150", label: "150ml", inStock: false },
  ],
  media = [],
}: ProductDetailsProps) {
  const safeMedia = media?.length ? media : [];
  const [active, setActive] = useState(safeMedia[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [like, setLike] = useState(false);

  const initialVariant = variants.find((v) => v.inStock) ?? variants[0];
  const [selected, setSelected] = useState(initialVariant?.id);

  const activeMedia = useMemo(
    () => safeMedia.find((m) => m.id === active) ?? safeMedia[0],
    [safeMedia, active]
  );

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  return (
    <div>
      <Navbar />

      <section className="page-container py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900">
              {activeMedia && (
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.alt ?? title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(min-width:1024px) 600px, 92vw"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {safeMedia.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  aria-label={`Show image ${m.id}`}
                  className={`relative h-20 w-20 min-w-[5rem] overflow-hidden rounded-xl border transition
                    ${
                      active === m.id
                        ? "border-[#827978]"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                    }`}
                >
                  <Image src={m.src} alt={m.alt ?? ""} fill className="object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {stars.map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-neutral-300 dark:text-neutral-700"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-black/70 dark:text-white/70">
                  {rating.toFixed(1)} • {reviewsCount} reviews
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-semibold text-black dark:text-white">
                  {price}
                </span>
                {inStock ? (
                  <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-3 py-1 text-xs font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 px-3 py-1 text-xs font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Variant selector */}
            {variants?.length ? (
              <div>
                <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-2">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isActive = v.id === selected;
                    const disabled = v.inStock === false;
                    return (
                      <button
                        key={v.id}
                        onClick={() => !disabled && setSelected(v.id)}
                        disabled={disabled}
                        className={`rounded-xl px-4 py-2 text-sm border transition
                          ${
                            isActive
                              ? "border-[#827978] bg-[#827978]/10 text-[#5b5651] dark:text-[#c8c2bd]"
                              : "border-neutral-300 dark:border-neutral-700"
                          }
                          ${
                            disabled
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:border-[#827978]"
                          }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-3">
              {/* Qty */}
              <div className="flex items-center rounded-xl border border-neutral-300 dark:border-neutral-700">
                <button
                  onClick={dec}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 min-w-[2ch] text-center tabular-nums text-black dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#827978] hover:bg-[#6f6862] text-white font-semibold px-5 py-3 transition"
                onClick={() => console.log("Add to cart", { selected, qty })}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              {/* Like */}
              <button
                onClick={() => setLike((v) => !v)}
                aria-pressed={like}
                className={`inline-flex items-center justify-center rounded-xl border px-3 py-3 transition
                  ${
                    like
                      ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700"
                      : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
              >
                <Heart size={18} className={like ? "fill-current" : ""} />
              </button>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <DetailsRow title="Description">
                <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
                  {description}
                </p>
              </DetailsRow>

              {notes?.length ? (
                <DetailsRow title="Notes">
                  <ul className="text-sm leading-relaxed text-black/80 dark:text-white/80 list-disc pl-5 space-y-1">
                    {notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </DetailsRow>
              ) : null}

              <DetailsRow title="Shipping & Returns" icon={<Truck size={16} />}>
                <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
                  {shippingInfo}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                  <ShieldCheck size={14} />
                  Secure checkout & buyer protection
                </div>
              </DetailsRow>
            </div>
          </div>
        </div>

        {/* Sticky mobile bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur">
          <div className="page-container py-3 flex items-center gap-3">
            <button
              onClick={() => setLike((v) => !v)}
              className={`inline-flex items-center justify-center rounded-xl border px-4 py-3 transition
                ${
                  like
                    ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}
              aria-label="Like"
            >
              <Heart size={18} className={like ? "fill-current" : ""} />
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#827978] hover:bg-[#6f6862] text-white font-semibold px-5 py-3 transition">
              <ShoppingCart size={18} />
              Add to Cart — {price}
            </button>
          </div>
          {/* iOS safe area */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </div>
        <div className="h-16 md:hidden" />
      </section>

      <Footer />
    </div>
  );
}

/** Simple disclosure row without external libs */
function DetailsRow({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
          {icon} {title}
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
