import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySection() {
  const [idx, setIdx] = useState(0);

  const { data: gallery, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery").select("*").eq("is_visible", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!gallery?.length) return;
    const t = setInterval(() => setIdx(p => (p + 1) % gallery.length), 5000);
    return () => clearInterval(t);
  }, [gallery?.length]);

  if (isLoading || !gallery?.length) return null;

  return (
    <section id="gallery" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute -top-8 left-8 text-[160px] font-black text-navy/[0.025] leading-none select-none pointer-events-none">05</div>

      <div className="container px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-right mb-16"
        >
          <div className="flex items-center gap-3 justify-end mb-5">
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">معرض الصور</span>
            <div className="gold-line" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-navy leading-tight">
            جولة داخل<br />
            <span className="text-gradient-gold">عيادتنا</span>
          </h2>
        </motion.div>

        {/* Gallery layout: big image + thumbnails strip */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={idx}
                src={gallery[idx].image_url}
                alt={gallery[idx].title || "صورة من العيادة"}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

            {/* Caption */}
            {gallery[idx].title && (
              <motion.div
                key={`cap-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 right-8 z-10"
              >
                <p className="text-white font-bold text-xl">{gallery[idx].title}</p>
              </motion.div>
            )}

            {/* Navigation arrows */}
            <button
              onClick={() => setIdx(p => (p - 1 + gallery.length) % gallery.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 border border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIdx(p => (p + 1) % gallery.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 border border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {gallery.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setIdx(i)}
                className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  i === idx ? "border-gold opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-75"
                }`}
              >
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
