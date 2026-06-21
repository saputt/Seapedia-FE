import React from "react";
import MainLayout from "../shared/components/layout/MainLayout";
import HeroSection from "../features/landing/components/HeroSection";
import FeaturedProducts from "../features/landing/components/FeaturedProducts";
import TestimonialSection from "../features/landing/components/TestimonialSection";

const LandingPage: React.FC = () => {
  return (
    <MainLayout navbarVariant="default">
      <HeroSection />
      <FeaturedProducts />
      <TestimonialSection />
    </MainLayout>
  );
};

export default LandingPage;
