import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
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
    <div className="relative group">
      {/* إطار خارجي ذهبي خفيف يعطي فخامة */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-navy/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      
      <div
        ref={containerRef}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-gold/10 shadow-2xl shadow-navy-dark/50"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* صورة بعد (الخلفية - النتيجة النهائية) */}
        <div className="absolute inset-0">
          <img
            src={transformation.after_image || "/placeholder.svg"}
            alt="بعد"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* شارة "بعد" - لون ذهبي فخم */}
          <div className="absolute top-4 left-4 bg-gold text-navy px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            بعد
          </div>
        </div>

        {/* صورة قبل (في الأمام - يتم قصها) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${100 - sliderPosition}%)` }}
        >
          <img
            src={transformation.before_image || "/placeholder.svg"}
            alt="قبل"
            className="w-full h-full object-cover filter brightness-90 grayscale-[0.2]" // تغميق بسيط لصورة "قبل" لزيادة التباين
            draggable={false}
          />
          {/* شارة "قبل" - لون كحلي شفاف */}
          <div className="absolute top-4 right-4 bg-navy/80 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
            قبل
          </div>
        </div>

        {/* مقبض السلايدر */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gold shadow-[0_0_10px_rgba(255,215,0,0.5)] z-20"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-navy border-2 border-gold shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing">
            <div className="flex gap-1 text-gold">
              <ChevronRight className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransformationsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // جلب البيانات (كما هي من الكود السابق)
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

  // التنقل التلقائي
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
      <section className="py-24 bg-navy">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto h-[500px] bg-navy-light/50 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!transformations?.length) return null;

  return (
    <section id="transformations" className="py-24 bg-navy relative overflow-hidden">
      {/* خلفية جمالية */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-light/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 relative z-10">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-gold font-bold tracking-wider text-sm mb-4 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-gold/10">
            <Star className="w-3 h-3 fill-gold" />
            نتائج حقيقية
            <Star className="w-3 h-3 fill-gold" />
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            شاهد الفرق <span className="text-gold">بنفسك</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            صور حقيقية لمرضانا توضح دقة العمل وجودة النتائج
          </p>
        </motion.div>

        {/* السلايدر الرئيسي */}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <BeforeAfterSlider transformation={transformations[currentIndex]} />
                
                {/* العنوان والوصف تحت الصورة */}
                <div className="text-center mt-8">
                  {transformations[currentIndex].title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      {transformations[currentIndex].title}
                    </motion.h3>
                  )}
                  {transformations[currentIndex].description && (
                    <p className="text-gold/80 text-lg">
                      {transformations[currentIndex].description}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* أزرار التنقل الجانبية */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
               <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-gold/20 bg-navy/50 text-gold hover:bg-gold hover:text-navy backdrop-blur-sm"
                onClick={goToNext} // زر اليسار للذهاب للتالي (لأن الموقع عربي RTL)
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
               <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-gold/20 bg-navy/50 text-gold hover:bg-gold hover:text-navy backdrop-blur-sm"
                onClick={goToPrev} // زر اليمين للسابق
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* نقاط التنقل السفلية */}
          <div className="flex justify-center gap-2 mt-10">
            {transformations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "bg-gold w-8"
                    : "bg-white/20 w-2 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

