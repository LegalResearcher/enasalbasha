import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon } from "lucide-react";

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

  // Autoplay functionality
  useEffect(() => {
    if (!gallery?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [gallery?.length]);

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-white">
        <div className="container px-4">
          <div className="aspect-[21/9] bg-gray-100 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!gallery?.length) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="container px-4">
        
        {/* رأس القسم بتصميم فخم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-bold tracking-wider text-sm mb-4 uppercase">
            معرض الصور
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">
            جولة في <span className="text-gold relative inline-block">
              عيادتنا
              {/* خط زخرفي ذهبي */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/30 rounded-full w-full"></span>
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            تعرف على عيادتنا الحديثة والمجهزة بأحدث التقنيات لراحتك وسلامتك
          </p>
        </motion.div>

        {/* عارض الصور (Carousel) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
          <div className="aspect-[21/9] relative">
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
            
            {/* طبقة تظليل كحلية متدرجة لضمان وضوح النص */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
          </div>

          {/* العنوان فوق الصورة */}
          {gallery[currentIndex].title && (
            <motion.div
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8 z-10"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-gold" />
                {gallery[currentIndex].title}
              </h3>
            </motion.div>
          )}

          {/* الصور المصغرة (Thumbnails) */}
          <div className="absolute bottom-8 left-8 flex gap-2 z-10">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-lg ${
                  index === currentIndex
                    ? "border-gold scale-110 opacity-100 ring-2 ring-gold/30"
                    : "border-white/20 opacity-60 hover:opacity-100 hover:border-white"
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

