import { motion } from "framer-motion";
import { Sparkles, Star, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToBooking = () => {
    const element = document.querySelector("#booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-teal/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gold/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-5 py-2 mb-8"
          >
            <Star className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">
              أفضل عيادة أسنان في اليمن
            </span>
            <Star className="w-4 h-4 text-gold" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-primary-foreground">ابتسامتك</span>{" "}
            <span className="text-gradient-gold">ثقتك</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gold/70 mb-4 max-w-2xl mx-auto"
          >
            مع الدكتورة إيناس الباشا
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          >
            نقدم لك أحدث تقنيات طب الأسنان التجميلي والعلاجي في بيئة مريحة
            وآمنة، لنمنحك الابتسامة التي تستحقها
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full sm:w-auto gap-2"
              onClick={scrollToBooking}
            >
              <Phone className="w-5 h-5" />
              احجز موعدك الآن
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              className="w-full sm:w-auto gap-2"
              onClick={() => {
                const element = document.querySelector("#services");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles className="w-5 h-5" />
              تعرف على خدماتنا
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "+10", label: "سنوات خبرة" },
              { value: "+5000", label: "مريض سعيد" },
              { value: "+15", label: "خدمة متخصصة" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gold/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
