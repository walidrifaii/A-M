"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, MessageCircle } from "lucide-react";

type MobileBubbleNavProps = {
  initialActiveId?: string;
  cartCount?: number;
  favCount?: number;
  onOpenCart?: () => void;
  onOpenFav?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
};

export default function MobileBubbleNav({
  initialActiveId = "home",
}: MobileBubbleNavProps) {
  const pathname = usePathname();
  const [active, setActive] = useState(initialActiveId);
  const [isVisible, setIsVisible] = useState(true);

  // ✅ Sync active state with pathname
  useEffect(() => {
    if (pathname === "/") setActive("home");
    else if (pathname.startsWith("/about")) setActive("about");
    else if (pathname.startsWith("/contact")) setActive("contact");
  }, [pathname]);

  // ✅ Scroll visibility effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      // Hide if near bottom
      if (scrollY + windowHeight >= documentHeight - 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ACTIVE_COLOR = "#445f21";
  const bubbleBase =
    "relative h-11 flex items-center justify-center transition-all duration-300 shadow-sm active:scale-[0.97] rounded-full overflow-hidden whitespace-nowrap px-4 gap-2";
  const activeStyle = { backgroundColor: ACTIVE_COLOR, color: "#ffffff", width: "auto", minWidth: "100px" };
  const inactiveStyle = { width: "44px", padding: "0" };

  // ✅ Hide visually instead of returning null (keeps hooks consistent)
  const shouldHide = pathname === "/success";

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[75] -translate-x-1/2 md:hidden transition-all duration-300 ${!isVisible || shouldHide
        ? "opacity-0 translate-y-8 pointer-events-none"
        : "opacity-100 translate-y-0"
        }`}
    >
      <div
        className="
          rounded-full border border-black/10 dark:border-white/10
          bg-[var(--background)]/90 backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          px-2.5 py-1.5 flex items-center gap-1.5
        "
      >
        {/* Home */}
        <Link
          href="/"
          onClick={() => setActive("home")}
          aria-label="Home"
          className={`${bubbleBase} ${active === "home"
            ? "text-[var(--background)]"
            : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
            }`}
          style={active === "home" ? activeStyle : inactiveStyle}
        >
          <Home size={18} />
          <span className={`text-xs font-bold transition-all duration-300 ${active === "home" ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
            Home
          </span>
        </Link>

        {/* About Us */}
        <Link
          href="/about"
          onClick={() => setActive("about")}
          aria-label="About Us"
          className={`${bubbleBase} ${active === "about"
            ? "text-[var(--background)]"
            : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
            }`}
          style={active === "about" ? activeStyle : inactiveStyle}
        >
          <Info size={18} />
          <span className={`text-xs font-bold transition-all duration-300 ${active === "about" ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
            About
          </span>
        </Link>

        {/* Contact Us */}
        <Link
          href="/contact"
          onClick={() => setActive("contact")}
          aria-label="Contact Us"
          className={`${bubbleBase} ${active === "contact"
            ? "text-[var(--background)]"
            : "bg-[var(--background)] text-[var(--foreground)] hover:opacity-80"
            }`}
          style={active === "contact" ? activeStyle : inactiveStyle}
        >
          <MessageCircle size={18} />
          <span className={`text-xs font-bold transition-all duration-300 ${active === "contact" ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
            Contact
          </span>
        </Link>


      </div>

      <div className="safe-bottom" />
    </div>
  );
}
