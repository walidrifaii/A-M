export type Variant = { id: string; label: string; inStock?: boolean };
export type Media = { id: string; src: string; alt?: string };

export type Product = {
  slug: string;
  title: string;
  price: string;         // e.g., "$129"
  rating?: number;       // 0..5
  reviewsCount?: number;
  inStock?: boolean;
  description: string;
  notes?: string[];
  shippingInfo?: string;
  variants: Variant[];
  media: Media[];
};
