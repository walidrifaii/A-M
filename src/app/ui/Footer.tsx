"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#f8f6f5] dark:bg-[#111] text-black dark:text-white transition-colors">
      <div className="page-container py-10 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left - Brand / About */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recreate Perfume</h2>
          <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed max-w-sm">
            Experience the art of scent — blending luxury and individuality.
            Our perfumes are inspired by timeless elegance and crafted to evoke emotion.
          </p>
        </div>

        {/* Center - Links */}
        <div className="flex-1 flex flex-col sm:flex-row gap-8 justify-between">
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
              <li><Link href="/#collection" className="hover:text-[#827978]">Collection</Link></li>
              <li><Link href="/#about" className="hover:text-[#827978]">About Us</Link></li>
              <li><Link href="/#contact" className="hover:text-[#827978]">Contact</Link></li>
              <li><Link href="/#faq" className="hover:text-[#827978]">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
              <li><Link href="#">Shipping & Returns</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Right - Social */}
        <div className="flex-1 space-y-4">
          <h3 className="text-base font-semibold">Follow Us</h3>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram" className="hover:text-[#827978]"><Instagram size={20} /></Link>
            <Link href="#" aria-label="Facebook" className="hover:text-[#827978]"><Facebook size={20} /></Link>
            <Link href="#" aria-label="Twitter" className="hover:text-[#827978]"><Twitter size={20} /></Link>
            <Link href="mailto:info@recreateperfume.com" aria-label="Mail" className="hover:text-[#827978]"><Mail size={20} /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-sm text-black/70 dark:text-white/70">
        © {new Date().getFullYear()} Recreate Perfume. All rights reserved.
      </div>
    </footer>
  );
}
