"use client";

import Image from "next/image";
import Link from "next/link";
import menImg from "@/assets/Giorgio-Armani-Emporio-Armani-Stronger-With-You-Perfume-By-Giorgio-Armani-EDT-For-Men-and-Women-50_ml-_1-f44d2a84.webp";
import womenImg from "@/assets/vecteezy_ai-generated-elegant-bottle-of-perfume-png_34763805.png";
import discountImg from "@/assets/perfume-bottle-with-shadow-free-png.webp";

export default function HeroShowcase() {
  return (
    <section className="page-container py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left large card */}
        <div className="relative overflow-hidden rounded-3xl lg:col-span-2 min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] bg-[#827978] dark:bg-[#6e6761] flex items-center justify-center px-6 sm:px-10">
  {/* Text Content */}
  <div className="relative z-10 flex flex-col gap-3 text-left max-w-sm mr-auto">
    <h3 className="text-3xl sm:text-4xl font-semibold text-white">
      Opening Sales 15%
    </h3>
    <p className="text-sm sm:text-base text-white/80">
      Enjoy 15% off on all products for a limited time.
    </p>
    <div className="mt-2">
      <Link
        href="/#collection"
        className="inline-flex items-center rounded-2xl bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow hover:bg-white"
      >
        Shop Now
      </Link>
    </div>
  </div>

  {/* Image */}
  <div className="relative flex justify-center items-center w-[50%]">
    <Image
      src={discountImg}
      alt="Perfume Bottle"
      className="w-full max-w-[300px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] animate-float drop-shadow-2xl select-none"
      priority
    />
  </div>
</div>


        {/* Right side stack */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Top Right */}
          <div className="relative overflow-hidden rounded-3xl min-h-[250px] sm:min-h-[250px] lg:min-h-[250px]">
            <div className="absolute inset-0">
              <Image
                src={menImg}
                alt="Men Collection"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end gap-2 p-4 sm:p-6">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Men Collection
              </h3>
              <p className="max-w-xl text-sm text-white/80 sm:text-base">
                Discover bold and timeless scents
              </p>
              <div className="mt-3">
                <Link
                  href="/#men"
                  className="inline-flex items-center rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-white"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="relative overflow-hidden rounded-3xl min-h-[250px] sm:min-h-[250px] lg:min-h-[250px]">
            <div className="absolute inset-0">
              <Image
                src={womenImg}
                alt="Women Collection"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end gap-2 p-4 sm:p-6">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Women Collection
              </h3>
              <p className="max-w-xl text-sm text-white/80 sm:text-base">
                Elegant, modern and unforgettable
              </p>
              <div className="mt-3">
                <Link
                  href="/#women"
                  className="inline-flex items-center rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-white"
                >
                  Explore
                </Link>
              </div>
            </div>
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
            transform: translateY(-15px);
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
