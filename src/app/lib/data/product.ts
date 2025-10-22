
import hero1 from "@/assets/perfume-1.webp";
import hero2 from "@/assets/perfume-2.webp";
import hero3 from "@/assets/perfume-3.png";
import { Product } from "../types/product";

export const PRODUCTS: Product[] = [
  {
    slug: "amber-no-1",
    title: "Amber No.1 — Eau de Parfum",
    price: "$129",
    rating: 4.6,
    reviewsCount: 128,
    inStock: true,
    description:
      "A warm, sophisticated blend of amber, vanilla, and rare resins. Crafted to linger beautifully and reveal new facets over time.",
    notes: ["Top: Bergamot, Saffron", "Heart: Amber, Rose", "Base: Vanilla, Oud, Musk"],
    shippingInfo: "Free shipping on orders over $100. 30-day returns. Duty included.",
    variants: [
      { id: "50", label: "50ml", inStock: true },
      { id: "100", label: "100ml", inStock: true },
      { id: "150", label: "150ml", inStock: false },
    ],
    media: [
      { id: "m1", src: hero1 as unknown as string, alt: "Bottle front" },
      { id: "m2", src: hero2 as unknown as string, alt: "Bottle detail" },
      { id: "m3", src: hero3 as unknown as string, alt: "Bottle on stand" },
    ],
  },
  // add more products...
];

export const getProductBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);
