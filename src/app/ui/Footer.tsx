"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200   text-[var(--foreground)]
     transition-colors duration-300 mx-auto  px-4 sm:px-6 lg:px-32">
      <div className=" py-10 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left - Brand / About */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Recreate Perfume</h2>
          <p className="text-sm text-[var(--foreground)]/70 leading-relaxed max-w-sm">
            Experience the art of scent — blending luxury and individuality.
            Our perfumes are inspired by timeless elegance and crafted to evoke emotion.
          </p>
        </div>

        {/* Center - Links */}
        <div className="flex-1 flex flex-col sm:flex-row gap-8 justify-between">
          <div>
            <h3 className="text-base font-semibold mb-3 text-[var(--foreground)]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/70">
              <li><Link href="/#collection" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">Collection</Link></li>
              <li><Link href="/#about" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link href="/#contact" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">Contact</Link></li>
              <li><Link href="/#faq" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3 text-[var(--foreground)]">Support</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/70">
              <li><Link href="#" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#445f21] dark:hover:text-brand-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Right - Social */}
        <div className="flex-1 space-y-4">
          <h3 className="text-base font-semibold text-[var(--foreground)]">Follow Us</h3>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram" className="text-[var(--foreground)]/70 hover:text-[#445f21] dark:hover:text-brand-400 transition-colors"><Instagram size={20} /></Link>
            <Link href="#" aria-label="Facebook" className="text-[var(--foreground)]/70 hover:text-[#445f21] dark:hover:text-brand-400 transition-colors"><Facebook size={20} /></Link>
            <Link href="#" aria-label="Twitter" className="text-[var(--foreground)]/70 hover:text-[#445f21] dark:hover:text-brand-400 transition-colors"><Twitter size={20} /></Link>
            <Link href="mailto:info@recreateperfume.com" aria-label="Mail" className="text-[var(--foreground)]/70 hover:text-[#445f21] dark:hover:text-brand-400 transition-colors"><Mail size={20} /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200  py-4 text-center text-sm text-[var(--foreground)]/70">
        © {new Date().getFullYear()} Recreate Perfume. All rights reserved.
      </div>
    </footer>
  );
}
