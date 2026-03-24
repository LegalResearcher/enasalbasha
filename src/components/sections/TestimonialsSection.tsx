import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials").select("*").eq("is_visible", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!testimonials?.length) return;
    const t = setInterval(() => setIdx(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [testimonials?.length]);

  if (isLoading || !testimonials?.length) return null;

  const current = testimonials[idx];

  return (
    <section id="testimonials" className="py-32 bg-[hsl(var(--navy-dark))] relative overflow-hidden">
      {/* Decorative large number */}
      <div className="absolute -top-8 right-8 text-[160px] font-black text-white/[0.02] leading-none select-none pointer-events-none">04</div>

      {/* Gold decorative circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/[0.07] pointer-events-none" />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="gold-line" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">آراء مرضانا</span>
            <div className="gold-line" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            يثقون بنا
          </h2>
        </motion.div>

        {/* Main quote card */}
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Large quote mark */}
              <div className="absolute -top-8 right-0 text-[100px] leading-none text-gold/10 font-serif select-none pointer-events-none">"</div>

              <div className="bg-white/[0.04] border border-white/8 rounded-3xl p-10 md:p-14 backdrop-blur-sm">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {Array(current.rating || 5).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-xl md:text-2xl text-white/80 font-light text-center leading-relaxed mb-10">
                  {current.review}
                </p>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-navy font-black text-lg">
                    {current.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{current.name}</p>
                    <p className="text-gold/50 text-sm mt-0.5">مريض العيادة</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setIdx(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-white/15 text-white/50 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-500 ${i === idx ? "bg-gold w-8 h-1.5" : "bg-white/20 w-1.5 h-1.5"}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIdx(p => (p + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-white/15 text-white/50 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
