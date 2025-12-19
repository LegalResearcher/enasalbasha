import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: gallery, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Autoplay
  useEffect(() => {
    if (!gallery?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [gallery?.length]);

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="aspect-[21/9] bg-muted rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!gallery?.length) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-teal font-medium mb-4">
            معرض الصور
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            جولة في <span className="text-gradient-teal">عيادتنا</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            تعرف على عيادتنا الحديثة والمجهزة بأحدث التقنيات
          </p>
        </motion.div>

        {/* Gallery Carousel */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="aspect-[21/9]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={gallery[currentIndex].image_url}
                alt={gallery[currentIndex].title || "صورة من العيادة"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
              />
            </AnimatePresence>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

          {/* Title */}
          {gallery[currentIndex].title && (
            <motion.div
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8"
            >
              <h3 className="text-2xl font-bold text-primary-foreground">
                {gallery[currentIndex].title}
              </h3>
            </motion.div>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-8 left-8 flex gap-2">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? "border-gold scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
