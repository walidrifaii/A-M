"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export type QuickProduct = {
  id: string;
  slug: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  image: string | StaticImageData;
  sizes?: string[];
  qty?: number; // <-- Add this
  maxQty?: number;
  shortDescription?: string;
  longDescription?: string;
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
  onConfirmAdd?: (p: QuickProduct, size: string, qty: number) => void;
}) {
  const sizes = product?.sizes?.length ? product.sizes : ["50ml", "100ml"];
  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);

  // reset on product change
 useEffect(() => {
  if (!product) return;
  setSize(product.sizes && product.sizes.length ? product.sizes[0] : "50ml");
  setQty(Math.max(1, Math.min(product.qty ?? 1, product.maxQty ?? 99))); // 👈 use product defaults/limits
}, [product]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dec = () => setQty((n) => Math.max(1, n - 1));
  const inc = () => setQty((n) => Math.min(99, n + 1));

  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <button
          className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-[1px]"
          onClick={onClose}
          aria-label="Close quick add"
        />
      )}

      {/* ---- Desktop centered modal ---- */}
      <div
        className={[
          "hidden md:flex fixed inset-0 z-[99] items-center justify-center p-4",
          "transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick add to cart"
          className={[
            "relative w-full max-w-[980px]",
            "bg-[var(--background)] text-[var(--foreground)]",
            "rounded-2xl shadow-2xl border border-neutral-200/70 dark:border-neutral-800",
            "transition-transform duration-300 transform-gpu",
            open ? "scale-100 translate-y-0" : "scale-95 translate-y-3",
            "overflow-hidden",
          ].join(" ")}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Image */}
            <div className="relative rounded-2xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 480px, 92vw"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <TitlePrice
                name={product.name}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                short={product.shortDescription}
              />

              <SizePicker sizes={sizes} selected={size} onSelect={setSize} />

              <Quantity
  qty={qty}
  onDec={() => setQty((n) => Math.max(1, n - 1))}
  onInc={() => setQty((n) => Math.min(product?.maxQty ?? 99, n + 1))}
  onChange={(v) => setQty(v)}
  min={1}
  max={product?.maxQty ?? 99}
/>

              {product.longDescription && (
                <p className="mt-4 text-sm leading-relaxed text-black/80 dark:text-white/80">
                  {product.longDescription}
                </p>
              )}

              <div className="mt-6 space-y-3">
                <button
                  className="w-full rounded-2xl bg-[#827978] hover:bg-[#6f6862] text-white font-semibold py-3 tracking-wide transition"
                  onClick={() => onConfirmAdd?.(product, size, qty)}
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
        </div>
      </div>

      {/* ---- Mobile bottom sheet ---- */}
      <div
        className={[
          "md:hidden fixed inset-x-0 bottom-0 z-[99]",
          "rounded-t-2xl bg-[var(--background)] text-[var(--foreground)]",
          "shadow-[0_-20px_60px_rgba(0,0,0,0.25)]",
          "max-h-[88vh] overflow-hidden",
          open ? "translate-y-0" : "translate-y-full pointer-events-none",
          "transition-transform duration-300 ease-out",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Quick add to cart"
      >
        {/* Grabber */}
        <div className="pt-2 flex justify-center">
          <span className="h-1.5 w-12 rounded-full bg-black/15 dark:bg-white/15" />
        </div>

        {/* Scroll area */}
        <div className="overflow-y-auto max-h-[calc(88vh-64px)]">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full  rounded-t-2xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="92vw"
              priority
            />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 h-9 w-9 rounded-xl bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white shadow flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <TitlePrice
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              short={product.shortDescription}
            />

            <SizePicker sizes={sizes} selected={size} onSelect={setSize} />

            <Quantity
  qty={qty}
  onDec={() => setQty((n) => Math.max(1, n - 1))}
  onInc={() => setQty((n) => Math.min(product?.maxQty ?? 99, n + 1))}
  onChange={(v) => setQty(v)}
  min={1}
  max={product?.maxQty ?? 99}
/>

            {product.longDescription && (
              <p className="mt-2 text-sm leading-relaxed opacity-80">{product.longDescription}</p>
            )}
          </div>
        </div>

        {/* Sticky CTA + safe area */}
        <div className="p-4 pt-2 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-[var(--background)]">
          <button
            className="w-full rounded-2xl bg-[#827978] hover:bg-[#6f6862] text-white font-semibold py-3 tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onConfirmAdd?.(product, size, qty)}
          >
            ADD TO CART →
          </button>
          <div className="safe-bottom" />
        </div>
      </div>
    </>
  );
}

/* --------- subcomponents --------- */

function TitlePrice({
  name,
  price,
  compareAtPrice,
  short,
}: {
  name: string;
  price: string;
  compareAtPrice?: string;
  short?: string;
}) {
  return (
    <>
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{name}</h2>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-lg font-semibold text-rose-600">{price}</span>
        {compareAtPrice && <span className="text-sm line-through opacity-60">{compareAtPrice}</span>}
      </div>
      {short && <p className="mt-2 text-sm text-black/80 dark:text-white/80">{short}</p>}
    </>
  );
}

function SizePicker({
  sizes,
  selected,
  onSelect,
}: {
  sizes?: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  if (!sizes?.length) return null;
  return (
    <div className="mt-5">
      <div className="text-xs mb-2 opacity-80">Size</div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const active = s === selected;
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={[
                "rounded-xl px-4 py-2 text-sm border transition",
                active
                  ? "border-[#827978] bg-[#827978]/10 text-[#5b5651] dark:text-[#c8c2bd]"
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
  );
}

function Quantity({
  qty,
  onDec,
  onInc,
  onChange,
  min = 1,
  max = 99,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <div className="flex items-center rounded-xl border border-neutral-300 dark:border-neutral-700">
        <button
          onClick={() => onChange(Math.max(min, qty - 1))}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Decrease"
        >
          <Minus size={16} />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={qty}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (Number.isNaN(val)) return;
            onChange(Math.max(min, Math.min(max, val)));
          }}
          className="w-14 text-center outline-none bg-transparent py-2 tabular-nums"
        />

        <button
          onClick={() => onChange(Math.min(max, qty + 1))}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Increase"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

