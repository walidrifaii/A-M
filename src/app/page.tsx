import HeroShowcase from "./ui/HeroShowcase";
import FeaturedProducts from "./ui/FeaturedProducts";
import TopMarketSlider from "./ui/TopMarketSlider";
import AboutRecreatePerfume from "./ui/AboutRecreatePerfume";
import Footer from "./ui/Footer";
import Navbar from "./ui/NavBar";
import MobileBubbleNav from "./components/MobileBubbleNav";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <MobileBubbleNav />

      <Navbar />
      <div className="mx-auto  px-4 sm:px-6 lg:px-32">
        <HeroShowcase />
        <FeaturedProducts />
        <section className=" py-10">
          <TopMarketSlider />
        </section>
        <AboutRecreatePerfume />
      </div>
      <Footer />

    </main>
  );
}
