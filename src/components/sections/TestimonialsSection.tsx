import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
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

  // التشغيل التلقائي (Autoplay)
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

  // حالة التحميل (Skeleton)
  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg animate-pulse border border-gray-100">
              <div className="h-24 bg-gray-200 rounded mb-6" />
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // في حال لا توجد بيانات
  if (!testimonials?.length) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* خلفية زخرفية خفيفة */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container px-4 relative z-10">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-bold tracking-wider text-sm mb-4 uppercase">
            آراء مرضانا
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">
            ماذا يقولون <span className="text-gold relative inline-block">
              عنا
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/30 rounded-full w-full"></span>
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            نفخر بثقة مرضانا وآرائهم الإيجابية التي تدفعنا دائماً لتقديم الأفضل
          </p>
        </motion.div>

        {/* صندوق الرأي (Slider Card) */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-navy/5 border border-gold/10 relative overflow-hidden"
            >
              {/* خط ذهبي علوي جمالي */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

              {/* أيقونة الاقتباس الخلفية */}
              <Quote className="absolute top-8 right-8 w-16 h-16 text-navy/5 rotate-180" />

              {/* النجوم */}
              <div className="flex justify-center gap-1.5 mb-8 relative z-10">
                {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-gold text-gold drop-shadow-sm"
                  />
                ))}
              </div>

              {/* نص الرأي */}
              <p className="text-xl sm:text-2xl text-navy font-medium text-center leading-relaxed mb-10 relative z-10">
                "{testimonials[currentIndex].review}"
              </p>

              {/* معلومات الشخص */}
              <div className="text-center relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center mb-4 shadow-lg shadow-navy/20 border-2 border-gold/20">
                  <span className="text-2xl font-bold text-gold">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-navy">
                  {testimonials[currentIndex].name}
                </h4>
                {/* إذا كان هناك حقل للدور الوظيفي في قاعدة البيانات يمكن إضافته هنا */}
                <div className="flex items-center gap-1 text-gold/80 text-sm mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>عميل مميز</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* أزرار التنقل */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-gold/20 text-navy hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 rounded-full w-12 h-12 hidden sm:flex shadow-md"
            onClick={goToPrev}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border-gold/20 text-navy hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 rounded-full w-12 h-12 hidden sm:flex shadow-md"
            onClick={goToNext}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* نقاط التنقل السفلية */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-navy/20 w-2 hover:bg-navy/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

