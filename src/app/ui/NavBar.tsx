"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { useStore } from "../store/StoreContext";
import MobileBubbleNav from "../components/MobileBubbleNav";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, favorites, removeCartItem, removeFavItem } = useStore();

  // Theme
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

 const cartCount = Array.isArray(cart) ? cart.reduce((n, i) => n + (i.qty || 1), 0) : 0;
const favCount = Array.isArray(favorites) ? favorites.length : 0;

  // Load theme
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = saved ? saved === "dark" : prefersDark;
      setIsDark(dark);
      applyThemeClass(dark ? "dark" : "light");
    } catch {}
  }, []);

  // Persist theme
  useEffect(() => {
    if (!mounted) return;
    applyThemeClass(isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  function applyThemeClass(mode: "dark" | "light") {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path fill="currentColor" d="M12 3l9 7-3 11H6L3 10l9-7z" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight">M&A</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-2 md:flex">
              <NavLink href="/" label="Home" pathname={pathname} />
              <NavLink href="/services" label="Services" pathname={pathname} />
              <NavLink href="/portfolio" label="Portfolio" pathname={pathname} />
              <NavLink href="/about" label="About" pathname={pathname} />
              <NavLink href="/contact" label="Contact" pathname={pathname} />

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark((v) => !v)}
                className="ml-2 rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Favorites */}
              <button
                onClick={() => setFavOpen(true)}
                className="relative ml-1 rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                aria-label="Open favorites"
              >
                <Heart className="h-5 w-5" />
                {favCount > 0 && <Badge count={favCount} />}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative ml-1 rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <Badge count={cartCount} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay */}
      {(cartOpen || favOpen) && (
        <button
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[1px]"
          onClick={() => {
            setCartOpen(false);
            setFavOpen(false);
          }}
          aria-label="Close panel"
        />
      )}

      {/* Cart Drawer */}
      <Drawer
        open={cartOpen}
        title="Your Cart"
        count={cartCount}
        onClose={() => setCartOpen(false)}
        items={cart}
        removeItem={removeCartItem}
        empty="Your cart is empty."
        checkout
      />

      {/* Favorites Drawer */}
      <Drawer
        open={favOpen}
        title="Favorites"
        count={favCount}
        onClose={() => setFavOpen(false)}
        items={favorites}
        removeItem={removeFavItem}
        empty="No favorites yet."
        checkout={false}
      />

      {/* Mobile Nav */}
      <MobileBubbleNav
        cartCount={cartCount}
        favCount={favCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenFav={() => setFavOpen(true)}
        onToggleTheme={() => setIsDark((v) => !v)}
        isDark={isDark}
      />
    </>
  );
}

/* ---------- Helper Components ---------- */

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = pathname === href;
  const base = "rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-yellow-400/50";
  const activeStyle = "bg-yellow-500 text-white shadow";
  const hover = "hover:bg-yellow-400/20";
  return <Link href={href} className={`${base} ${active ? activeStyle : hover}`}>{label}</Link>;
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#827978] text-white text-[10px] font-semibold flex items-center justify-center">
      {count}
    </span>
  );
}

interface DrawerItem { id: string; name: string; price?: string; qty?: number; image?: string; }

function Drawer({
  open,
  title,
  count,
  onClose,
  items,
  removeItem,
  empty,
  checkout,
}: {
  open: boolean;
  title: string;
  count: number;
  onClose: () => void;
  items: DrawerItem[];
  removeItem: (id: string) => void;
  empty: string;
  checkout?: boolean;
}) {
  return (
    <aside
      role="dialog"
      aria-modal="true"
      className={`fixed right-0 top-0 z-[81] h-dvh w-[86%] max-w-sm bg-[var(--background)] text-[var(--foreground)] shadow-2xl transition-transform duration-300 transform-gpu ${
        open ? "translate-x-0" : "translate-x-full"
      } rounded-l-2xl`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/70">
        <h3 className="text-base font-semibold">{title} ({count})</h3>
        <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-black/5">Close</button>
      </div>

<div className="p-4 space-y-3 overflow-y-auto h-[calc(100dvh-52px-72px)] pb-24">     {Array.isArray(items) && items.length > 0 ? (
  items.map((i, idx) => (
    <div key={i.id ?? idx} className="flex items-center gap-3 rounded-xl border border-neutral-200/70 p-3">
      {/* Product Image */}
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-neutral-200/60">
        {typeof i !== 'string' && i.image && (
          <Image
            src={i.image}
            alt={i.name}
            className="h-full w-full object-cover"
            width="12"
            height="12"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <p className="text-sm font-medium">{typeof i === 'string' ? i : i.name}</p>
        {typeof i !== 'string' && i.price && (
          <p className="text-xs opacity-70">{i.price}{i.qty && ` • Qty ${i.qty}`}</p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(typeof i === 'string' ? i : i.id)}
        className="p-2 rounded-lg hover:bg-black/5"
      >
        <Trash2 size={16} />
      </button>
    </div>
  ))
) : (
  <p className="text-sm opacity-70">{empty}</p>
)}

      </div>

      {checkout && (
        <div className="pb-10 px-4 pt-2 border-t border-neutral-200/70">
          <Link href="/checkout"   onClick={() => onClose()}
 className="block w-full rounded-xl bg-[#827978] hover:bg-[#6f6862] text-white text-center font-semibold py-3">
            Checkout
          </Link>
        </div>
      )}
    </aside>
  );
}
