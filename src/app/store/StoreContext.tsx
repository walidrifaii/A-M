"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type QuickProduct = {
  id: string;
  slug?: string;
  name: string;
  price: string;
  image: string;
  sizes?: string[];
  qty?: number;
  selectedSize?: string;
};

interface StoreContextType {
  cart: QuickProduct[];
  favorites: QuickProduct[];
  addToCart: (p: QuickProduct) => void;
 addFavorite: (p: QuickProduct, action?: "remove") => void;
   removeCartItem: (id: string) => void;
  removeFavItem: (id: string) => void;
}

const StoreCtx = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<QuickProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<QuickProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("favorites");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist favorites
  useEffect(() => {
    try {
      if (Array.isArray(favorites)) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } catch {}
  }, [favorites]);

  const addToCart = (p: QuickProduct) => {
  const addQty = Math.max(1, p.qty ?? 1); // 👈 use qty from caller, fallback 1

  setCart((prev) => {
    // treat same product but different size as different line items
    const idx = prev.findIndex(
      (i) => i.id === p.id && i.selectedSize === p.selectedSize
    );

    if (idx >= 0) {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        qty: (next[idx].qty ?? 1) + addQty, // 👈 increment by passed qty
      };
      return next;
    }

    // new line
    return [...prev, { ...p, qty: addQty }];
  });
};

interface AddFavoriteOptions {
  action?: "remove";
}

const addFavorite = (
  product: QuickProduct,
  action?: AddFavoriteOptions["action"]
) => {
  setFavorites((prev: QuickProduct[]) => {
    let updated: QuickProduct[];
    if (action === "remove") {
      updated = prev.filter((f: QuickProduct) => f.id !== product.id);
    } else {
      const exists = prev.some((f: QuickProduct) => f.id === product.id);
      updated = exists ? prev : [...prev, product];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    return updated;
  });
};

  const removeCartItem = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const removeFavItem = (id: string) =>
    setFavorites((prev) => prev.filter((i) => i.id !== id));

  return (
    <StoreCtx.Provider
      value={{ cart, favorites, addToCart, addFavorite, removeCartItem, removeFavItem }}
    >
      {children}
    </StoreCtx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
