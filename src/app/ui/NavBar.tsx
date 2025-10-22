"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, Heart, Trash2 } from "lucide-react";
import MobileBubbleNav from "../components/MobileBubbleNav";

export default function Navbar() {
  const pathname = usePathname();

  // Theme
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  // Mock Data (replace with real store later)
  const [cartItems, setCartItems] = useState([
    { id: "c1", name: "Amber No.1 (50ml)", price: "$129", qty: 1 },
    { id: "c2", name: "Citrus Bloom (100ml)", price: "$99", qty: 2 },
  ]);
  const [favItems, setFavItems] = useState([
    { id: "w1", name: "Velvet Rose", price: "$149" },
  ]);

  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const favCount = favItems.length;

  // Load theme from localStorage or system
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = saved ? saved === "dark" : prefersDark;
      setIsDark(dark);
      applyThemeClass(dark ? "dark" : "light");
    } catch {}
  }, []);

  // Persist theme
  useEffect(() => {
    if (!mounted) return;
    applyThemeClass(isDark ? "dark" : "light");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark, mounted]);

  function applyThemeClass(mode: "dark" | "light") {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
  }

  function removeCart(id: string) {
    setCartItems((arr) => arr.filter((i) => i.id !== id));
  }

  function removeFav(id: string) {
    setFavItems((arr) => arr.filter((i) => i.id !== id));
  }

  return (
    <>
      {/* Header */}
      <header
        className="sticky top-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
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

            {/* Desktop Nav ONLY (hidden on mobile) */}
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
                style={{ color: "var(--foreground)" }}
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
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[81] h-dvh w-[86%] max-w-sm bg-[var(--background)] text-[var(--foreground)] shadow-2xl transition-transform duration-300 transform-gpu ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl`}
      >
        <DrawerHeader title="Your Cart" count={cartCount} onClose={() => setCartOpen(false)} />
        <DrawerList items={cartItems} removeItem={removeCart} empty="Your cart is empty." />
        <div className="p-4 border-t border-neutral-200/70">
          <Link
            href="/checkout"
            className="block w-full rounded-xl bg-[#827978] hover:bg-[#6f6862] text-white text-center font-semibold py-3"
          >
            Checkout
          </Link>
        </div>
      </aside>

      {/* Favorites Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[81] h-dvh w-[86%] max-w-sm bg-[var(--background)] text-[var(--foreground)] shadow-2xl transition-transform duration-300 transform-gpu ${
          favOpen ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl`}
      >
        <DrawerHeader title="Favorites" count={favCount} onClose={() => setFavOpen(false)} />
        <DrawerList items={favItems} removeItem={removeFav} empty="No favorites yet." />
        <div className="p-4 border-t border-neutral-200/70">
          <Link
            href="/wishlist"
            className="block w-full rounded-xl border border-neutral-300/70 hover:bg-black/5 py-3 text-center font-medium"
          >
            View Wishlist
          </Link>
        </div>
      </aside>

      {/* Mobile Floating Nav (replaces hamburger) */}
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

function NavLink({
  href,
  label,
  pathname,
  mobile = false, // kept for API compatibility
}: {
  href: string;
  label: string;
  pathname: string;
  mobile?: boolean;
}) {
  const active = pathname === href;
  const base =
    "rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-yellow-400/50";
  const activeStyle = "bg-yellow-500 text-white shadow";
  const hover = "hover:bg-yellow-400/20";

  return (
    <Link
      href={href}
      className={`${base} ${active ? activeStyle : hover} ${
        mobile ? "block text-base" : ""
      }`}
    >
      {label}
    </Link>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#827978] text-white text-[10px] font-semibold flex items-center justify-center">
      {count}
    </span>
  );
}

function DrawerHeader({
  title,
  count,
  onClose,
}: {
  title: string;
  count: number;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/70">
      <h3 className="text-base font-semibold">
        {title} ({count})
      </h3>
      <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-black/5">
        Close
      </button>
    </div>
  );
}

interface DrawerItem {
  id: string;
  name: string;
  price?: string;
  qty?: number;
}

function DrawerList({
  items,
  removeItem,
  empty,
}: {
  items: DrawerItem[];
  removeItem: (id: string) => void;
  empty: string;
}) {
  return (
    <div className="p-4 space-y-3 overflow-y-auto h-[calc(100dvh-52px-72px)]">
      {items.length === 0 && <p className="text-sm opacity-70">{empty}</p>}
      {items.map((i) => (
        <div
          key={i.id}
          className="flex items-center gap-3 rounded-xl border border-neutral-200/70 p-3"
        >
          <div className="h-12 w-12 rounded-lg bg-neutral-200/60" />
          <div className="flex-1">
            <p className="text-sm font-medium">{i.name}</p>
            {i.price && (
              <p className="text-xs opacity-70">
                {i.price}
                {i.qty && ` • Qty ${i.qty}`}
              </p>
            )}
          </div>
          <button onClick={() => removeItem(i.id)} className="p-2 rounded-lg hover:bg-black/5">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
