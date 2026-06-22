import React from "react";
import MainLayout from "../shared/components/layout/MainLayout";
import HeroSection from "../features/landing/components/HeroSection";
import AboutSection from "../features/landing/components/AboutSection";
import HowItWorksSection from "../features/landing/components/HowItWorksSection";
import TestimonialSection from "../features/landing/components/TestimonialSection";

const LandingPage: React.FC = () => {
  return (
    <MainLayout navbarVariant="default">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <TestimonialSection />
    </MainLayout>
  );
};

export default LandingPage;
