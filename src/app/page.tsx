import Navbar from "./ui/NavBar";
import HeroShowcase from "./ui/HeroShowcase";
import FeaturedProducts from "./ui/FeaturedProducts";
import TopMarketSlider from "./ui/TopMarketSlider";
import AboutRecreatePerfume from "./ui/AboutRecreatePerfume";
import Footer from "./ui/Footer";
import MobileBubbleNav from "./components/MobileBubbleNav";

export default function Home() {
  return (
     <main className="overflow-x-clip">
       <MobileBubbleNav
        // Use your own icons & links here
        // activeColor="#827978"  // <- brand color option
      />
      <Navbar />
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
