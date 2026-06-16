import Navbar from "../../shared/components/layout/Navbar";
import Footer from "../../shared/components/layout/Footer";
import HeroSection from "../../features/landing/components/HeroSection";
import FeaturedProducts from "../../features/landing/components/FeaturedProducts";
import TestimonialSection from "../../features/landing/components/TestimonialSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
