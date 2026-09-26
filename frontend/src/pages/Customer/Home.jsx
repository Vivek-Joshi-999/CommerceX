import Hero from "../../components/home/Hero";
import ServiceHighlights from "../../components/home/ServiceHighlights";
import CategorySection from "../../components/home/CategorySection";
import FeaturedProducts from "../../components/home/FeaturedProducts";

function Home() {
  return (
    <>
      <Hero />
      <ServiceHighlights />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}

export default Home;