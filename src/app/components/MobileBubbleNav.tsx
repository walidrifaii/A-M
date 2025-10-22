"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Grid2X2, Heart, ShoppingCart, Sun, Moon } from "lucide-react";

export default function MobileBubbleNav({
  initialActiveId = "home",
  cartCount = 0,
  favCount = 0,
  onOpenCart,
  onOpenFav,
  onToggleTheme,
  isDark = false,
}: {
  initialActiveId?: string;
  cartCount?: number;
  favCount?: number;
  onOpenCart?: () => void;
  onOpenFav?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}) {
  const [active, setActive] = useState(initialActiveId);

  const ACTIVE_COLOR = "#f0b100"; // <- your requested color
  const bubbleBase =
    "relative h-11 w-11 rounded-full flex items-center justify-center transition shadow-sm active:scale-[0.97]";

  const activeStyle = { backgroundColor: ACTIVE_COLOR, color: "#111111" }; // dark text on yellow

  return (
    <div className="fixed bottom-5 left-1/2 z-[75] -translate-x-1/2 md:hidden">
      <div
        className="
          rounded-full border border-black/10 dark:border-white/10
          bg-[var(--background)]/90 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          px-2.5 py-1.5 flex items-center gap-1.5
        "
      >
        {/* Home (link) */}
        <Link
          href="/"
          onClick={() => setActive("home")}
          aria-label="Home"
          className={`${bubbleBase} ${
            active === "home"
              ? "text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
          }`}
          style={active === "home" ? activeStyle : undefined}
        >
          <Home size={18} />
        </Link>

        {/* All Products (link) */}
        <Link
          href="/#products"
          onClick={() => setActive("all")}
          aria-label="All Products"
          className={`${bubbleBase} ${
            active === "all"
              ? "text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
          }`}
          style={active === "all" ? activeStyle : undefined}
        >
          <Grid2X2 size={18} />
        </Link>

        {/* Favorites (opens drawer) */}
        <button
          type="button"
          onClick={onOpenFav}
          aria-label="Favorites"
          className={`${bubbleBase} ${
            active === "fav"
              ? "text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
          }`}
          style={active === "fav" ? activeStyle : undefined}
          onMouseDown={() => setActive("fav")}
        >
          <Heart size={18} />
          {favCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#827978] text-white text-[10px] font-semibold flex items-center justify-center">
              {favCount}
            </span>
          )}
        </button>

        {/* Cart (opens drawer) */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Cart"
          className={`${bubbleBase} ${
            active === "cart"
              ? "text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
          }`}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#827978] text-white text-[10px] font-semibold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Tiny divider dot */}
        <span className="mx-0.5 h-2 w-2 rounded-full bg-[var(--foreground)]/10" />

        {/* Theme toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Light mode" : "Dark mode"}
          className={`${bubbleBase} bg-[var(--background)] text-[var(--foreground)] hover:opacity-80`}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* iOS safe area */}
      <div className="safe-bottom" />
    </div>
  );
}
