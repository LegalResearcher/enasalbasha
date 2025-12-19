import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Autoplay
  useEffect(() => {
    if (!testimonials?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const goToPrev = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    if (!testimonials?.length) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-3xl p-12 animate-pulse">
              <div className="h-24 bg-muted rounded mb-6" />
              <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-teal font-medium mb-4">
            آراء مرضانا
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            ماذا يقولون <span className="text-gradient-teal">عنا</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            نفخر بثقة مرضانا وآرائهم الإيجابية
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl p-8 sm:p-12 shadow-xl border border-border relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-8 right-8 w-12 h-12 text-teal/20" />

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-xl sm:text-2xl text-foreground text-center leading-relaxed mb-8">
                "{testimonials[currentIndex].review}"
              </p>

              {/* Name */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal to-teal-light flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground">
                  {testimonials[currentIndex].name}
                </h4>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2"
            onClick={goToPrev}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2"
            onClick={goToNext}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-teal w-8"
                    : "bg-teal/30 hover:bg-teal/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
