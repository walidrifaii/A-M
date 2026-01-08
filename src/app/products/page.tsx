import { Suspense } from "react";
import ProductsPage from "./ProductPage";
import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import MobileBubbleNav from "../components/MobileBubbleNav";
import PageSkeleton from "../components/loading/PageSkeleton";

export default function Page() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
      <MobileBubbleNav />
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-32 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
            Our Collections
          </h1>
          <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto leading-relaxed">
            Explore our curated selection of world-class fragrances, meticulously crafted
            to match the legacy of original scents.
          </p>
        </header>

        <Suspense fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
            <PageSkeleton rows={3} />
            <p className="animate-pulse font-medium opacity-50">Curating your collection...</p>
          </div>
        }>
          <ProductsPage />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
