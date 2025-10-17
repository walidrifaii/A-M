"use client";

import Image from "next/image";
import Link from "next/link";
import perfumImg from "@/assets/perfume-bottle-with-shadow-free-png.webp";
import standImg from "@/assets/standed.png";

export default function AboutRecreatePerfume() {
  return (
    <section className="page-container py-12 sm:py-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-8 sm:p-12">
        {/* Left: Description */}
        <div className="flex-1 space-y-5 text-left">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#3a3531] dark:text-white">
            Recreate the Essence of Luxury
          </h2>
          <p className="text-[#5c5753] dark:text-gray-300 text-base sm:text-lg leading-relaxed">
            At <span className="font-semibold">Recreate Perfume</span>, we bring
            back timeless fragrances that speak to your soul. Our passion lies
            in blending artistry and science to recreate the world's most iconic
            perfumes — capturing every note with precision and emotion.
          </p>
          <p className="text-[#5c5753] dark:text-gray-300 text-base sm:text-lg leading-relaxed">
            Experience elegance that lasts, crafted with premium ingredients
            designed to mirror luxury scents in both quality and sophistication.
          </p>

          <div className="pt-4">
            <Link
              href="/#collection"
              className="inline-flex items-center rounded-2xl bg-[#827978] hover:bg-[#6f6862] text-white font-semibold px-6 py-3 shadow-md transition-all"
            >
              Discover Your Fragrance
            </Link>
          </div>
        </div>

        {/* Right: Images */}
        <div className="flex-1 relative flex justify-center items-center">
          {/* Background stand */}
          <div className="relative w-[280px] sm:w-[340px] md:w-[400px]">
            <Image
              src={standImg}
              alt="Perfume Stand Background"
              className="rounded-2xl object-contain"
              priority
            />
          </div>

          {/* Perfume bottle — moved slightly upward */}
          <div className="absolute bottom-12 sm:bottom-16">
            <Image
              src={perfumImg}
              alt="Perfume Bottle"
              className="w-[140px] sm:w-[180px] md:w-[220px] animate-float drop-shadow-2xl select-none"
              priority
            />
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
