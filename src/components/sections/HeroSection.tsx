import { Button } from "@/components/ui/button";
import { Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ 
        // استدعاء صورة الخلفية التي رفعتها
        backgroundImage: 'url("/hero-bg.jpg")' 
      }}
    >
      {/* الطبقة الشفافة (Overlay):
          توضع فوق الصورة لتغميقها وجعل النص واضحاً.
          bg-navy/90 = لون كحلي بنسبة شفافية 90% (داكن وفخم)
      */}
      <div className="absolute inset-0 bg-navy/90" />

      {/* المحتوى (النصوص والأزرار) - z-10 ليكون فوق الطبقة الشفافة */}
      <div className="container relative z-10 px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* الشعار الصغير أعلى العنوان */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="px-6 py-2 rounded-full border border-gold/30 bg-navy-light/30 backdrop-blur-sm text-gold mb-6">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                أفضل عيادة أسنان في اليمن
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            ابتسامتك <span className="text-gold">ثقتك</span>
          </motion.h1>

          {/* العنوان الفرعي */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 font-light"
          >
            مع الدكتورة إيناس الباشا
          </motion.p>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            نقدم لك أحدث تقنيات طب الأسنان التجميلي والعلاجي في بيئة مريحة وآمنة، لنمنحك الابتسامة التي تستحقها
          </motion.p>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 bg-gold hover:bg-gold-light text-navy font-bold"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Phone className="mr-2 h-5 w-5" />
              احجز موعدك الآن
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-gold text-gold hover:bg-gold/10"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              تعرف على خدماتنا
            </Button>
          </motion.div>

          {/* الإحصائيات السفلية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-3 gap-8 pt-16 border-t border-white/10 mt-16"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gold mb-1">10+</h3>
              <p className="text-sm text-gray-400">سنوات خبرة</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gold mb-1">5000+</h3>
              <p className="text-sm text-gray-400">مريض سعيد</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gold mb-1">15+</h3>
              <p className="text-sm text-gray-400">خدمة متخصصة</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

