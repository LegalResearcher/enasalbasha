import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TransformationsSection } from "@/components/sections/TransformationsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { BookingSection } from "@/components/sections/BookingSection";
import { ContactSection } from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TransformationsSection />
        <TestimonialsSection />
        <GallerySection />
        <FAQSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
