import HeroShowcase from "./ui/HeroShowcase";
import FeaturedProducts from "./ui/FeaturedProducts";
import TopMarketSlider from "./ui/TopMarketSlider";
import AboutRecreatePerfume from "./ui/AboutRecreatePerfume";
import Footer from "./ui/Footer";

export default function Home() {
  return (
     <main className="overflow-x-clip">
       
      <HeroShowcase />
      <FeaturedProducts />
      <section className="page-container py-10">
        <TopMarketSlider />
      </section>
      <AboutRecreatePerfume />
      <Footer />
    </main>
  );
}
