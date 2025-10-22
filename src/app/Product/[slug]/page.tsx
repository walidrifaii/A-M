import ProductDetailsClient, { ProductDetailsProps } from "@/app/components/products/ProductDetailsClient";
import type { Metadata } from "next";
 

// Only these are allowed on a page:
type PageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// ---- Replace with your real data fetching
async function getProduct(slug: string): Promise<ProductDetailsProps> {
  // Demo data (you can fetch from DB/API here)
  return {
    title: `Amber No.1 (${slug}) — Eau de Parfum`,
    price: "$129",
    rating: 4.6,
    reviewsCount: 128,
    inStock: true,
    description:
      "A warm, sophisticated blend of amber, vanilla, and rare resins. Crafted to linger beautifully and reveal new facets over time.",
    notes: [
      "Top: Bergamot, Saffron",
      "Heart: Amber, Rose",
      "Base: Vanilla, Oud, Musk",
    ],
    shippingInfo: "Free shipping on orders over $100. 30-day returns. Duty included.",
    variants: [
      { id: "50", label: "50ml", inStock: true },
      { id: "100", label: "100ml", inStock: true },
      { id: "150", label: "150ml", inStock: false },
    ],
    // You can also return external URLs (string) here
    media: [
      { id: "m1", src: "/images/amber-1.png", alt: "Bottle 1" },
      { id: "m2", src: "/images/amber-2.png", alt: "Bottle 2" },
      { id: "m3", src: "/images/amber-3.png", alt: "Bottle 3" },
    ],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await getProduct(params.slug);
  return {
    title: `${p.title} · M&A`,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      images: p.media?.[0]?.src ? [{ url: typeof p.media[0].src === "string" ? p.media[0].src : "" }] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const product = await getProduct(params.slug);
  // Hand off to a CLIENT component that can accept any props
  return <ProductDetailsClient {...product} />;
}
