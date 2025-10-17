"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export type NavItem = { label: string; href: string };

interface NavbarProps {
  brand?: { name?: string; logoSrc?: string };
  items?: NavItem[];
  cta?: { label: string; href: string };
}

/**
 * Tailwind v4-compatible navbar
 * - Uses CSS variables (var(--background), var(--foreground)) for colors
 * - Manual theme toggle via an HTML class: `theme-dark`
 * - Keeps gold accents for buttons/active states
 *
 * IMPORTANT (add to your global CSS — app/globals.css):
 * ----------------------------------------------------
 * @import "tailwindcss";
 *
 * :root {
 *   --background: #ffffff;
 *   --foreground: #171717;
 * }
 *
 * @theme inline {
 *   --color-background: var(--background);
 *   --color-foreground: var(--foreground);
 * }
 *
 * @media (prefers-color-scheme: dark) {
 *   :root { --background: #0a0a0a; --foreground: #ededed; }
 * }
 *
 * Manual toggle class overrides system preference when present
 * html.theme-dark { --background: #0a0a0a; --foreground: #ededed; }
 * html.theme-light { --background: #ffffff; --foreground: #171717; }
 * ----------------------------------------------------
 */

export default function Navbar({
  brand = { name: "M&A" },
  items = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta = { label: "Get Started", href: "/contact" },
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Close mobile on route change
  useEffect(() => setOpen(false), [pathname]);

  // On mount: sync from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark =
        typeof window !== "undefined" && typeof window.matchMedia === "function"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false;
      const dark = saved ? saved === "dark" : prefersDark;
      setIsDark(dark);
      applyThemeClass(dark ? "dark" : "light");
    } catch {
      // fallback: no-op
    }
  }, []);

  // Apply + persist when toggled
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

  return (
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
            <span className="text-lg font-semibold tracking-tight">
              {brand.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    active
                      ? "bg-yellow-500 text-white shadow"
                      : "hover:bg-yellow-400/20"
                  }`}
                  style={{ color: active ? undefined : "var(--foreground)" }}
                >
                  {item.label}
                </Link>
              );
            })}
            {cta && (
              <Link
                href={cta.href}
                className="ml-2 rounded-2xl border border-yellow-400/50 bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              >
                {cta.label}
              </Link>
            )}
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((v) => !v)}
              className="ml-4 rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              aria-label="Toggle theme"
              title={isDark ? "Switch to light" : "Switch to dark"}
              style={{ color: "var(--foreground)" }}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ color: "var(--foreground)" }}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${open ? "block" : "hidden"} pb-4`}>
          <div className="mt-2 space-y-2">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-base transition focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    active
                      ? "bg-yellow-500 text-white shadow"
                      : "hover:bg-yellow-400/20"
                  }`}
                  style={{ color: active ? undefined : "var(--foreground)" }}
                >
                  {item.label}
                </Link>
              );
            })}
            {cta && (
              <Link
                href={cta.href}
                className="block rounded-2xl border border-yellow-400/50 bg-yellow-500 px-4 py-2 text-center text-sm font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              >
                {cta.label}
              </Link>
            )}
            <button
              onClick={() => setIsDark((v) => !v)}
              className="w-full rounded-xl bg-yellow-400/20 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              style={{ color: "var(--foreground)" }}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
