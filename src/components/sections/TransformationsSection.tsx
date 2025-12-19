import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transformation {
  id: string;
  title: string;
  before_image: string;
  after_image: string;
  description: string | null;
}

function BeforeAfterSlider({ transformation }: { transformation: Transformation }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <img
          src={transformation.after_image || "/placeholder.svg"}
          alt="بعد"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-teal/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          بعد
        </div>
      </div>

      {/* Before Image (Foreground with clip) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${100 - sliderPosition}%)` }}
      >
        <img
          src={transformation.before_image || "/placeholder.svg"}
          alt="قبل"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-navy/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          قبل
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gold shadow-lg shadow-gold/50"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold shadow-lg shadow-gold/50 flex items-center justify-center">
          <div className="flex gap-0.5">
            <ChevronRight className="w-4 h-4 text-navy" />
            <ChevronLeft className="w-4 h-4 text-navy" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransformationsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: transformations, isLoading } = useQuery({
    queryKey: ["transformations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transformations")
        .select("*")
        .eq("is_visible", true)
        .order("display_order")
        .limit(15);
      if (error) throw error;
      return data as Transformation[];
    },
  });

  // Autoplay
  useEffect(() => {
    if (!transformations?.length || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % transformations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [transformations?.length, isPaused]);

  const goToPrev = () => {
    if (!transformations?.length) return;
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  const goToNext = () => {
    if (!transformations?.length) return;
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  };

  if (isLoading) {
    return (
      <section id="transformations" className="py-24 bg-navy">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[4/3] bg-navy-light rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!transformations?.length) {
    return null;
  }

  return (
    <section id="transformations" className="py-24 bg-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
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
          <span className="inline-block text-gold font-medium mb-4">
            نتائج حقيقية
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            قبل <span className="text-gradient-gold">وبعد</span>
          </h2>
          <p className="text-gold/60 max-w-2xl mx-auto text-lg">
            شاهد التحولات المذهلة التي أجريناها لمرضانا
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <BeforeAfterSlider transformation={transformations[currentIndex]} />
                
                {/* Title */}
                {transformations[currentIndex].title && (
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xl font-bold text-gold mt-6"
                  >
                    {transformations[currentIndex].title}
                  </motion.h3>
                )}
                {transformations[currentIndex].description && (
                  <p className="text-center text-gold/60 mt-2">
                    {transformations[currentIndex].description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              variant="glass"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
              onClick={goToPrev}
            >
              <ChevronRight className="w-5 h-5 text-gold" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
              onClick={goToNext}
            >
              <ChevronLeft className="w-5 h-5 text-gold" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {transformations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-gold/30 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
