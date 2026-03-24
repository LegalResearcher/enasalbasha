import { Button } from "@/components/ui/button";
import { Phone, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "10+", label: "سنوات خبرة" },
  { value: "5000+", label: "مريض سعيد" },
  { value: "15+", label: "تخصص طبي" },
];

export function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[hsl(var(--navy-dark))]"
    >
      {/* Background image with proper overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      />
      {/* Layered overlay: dark at top/bottom, less dark in middle to show image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy-dark))]/80 via-[hsl(var(--navy))]/60 to-[hsl(var(--navy-dark))]/90" />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--navy-dark))/70_100%)]" />

      {/* Decorative gold lines */}
      <div className="absolute top-0 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/30 to-transparent" style={{right:'10%'}} />
      <div className="absolute top-0 left-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" style={{left:'15%'}} />

      <div className="container relative z-10 px-6 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Pre-title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 justify-center mb-8"
          >
            <span className="h-px w-12 bg-gold/50" />
            <span className="text-gold/80 text-xs tracking-[0.25em] uppercase font-medium">التميز في طب وتجميل الأسنان</span>
            <span className="h-px w-12 bg-gold/50" />
          </motion.div>

          {/* Main headline — asymmetric, large */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center leading-[1.1] mb-6"
          >
            <span className="block text-5xl md:text-8xl font-black text-white tracking-tight">ابتسامتك</span>
            <span className="block text-5xl md:text-8xl font-black text-gradient-gold tracking-tight">ثقتك</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-center text-lg md:text-xl text-white/55 font-light max-w-xl mx-auto leading-relaxed mb-12"
          >
            مع الدكتورة إيناس الباشا — أحدث تقنيات طب الأسنان التجميلي في بيئة مريحة وآمنة
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Button
              onClick={() => scrollTo("booking")}
              className="w-full sm:w-auto bg-gold hover:bg-gold-light text-navy font-bold px-10 py-6 rounded-full text-base tracking-wide shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:-translate-y-1 transition-all duration-300"
            >
              <Phone className="w-4 h-4 ml-2" />
              احجز موعدك الآن
            </Button>
            <button
              onClick={() => scrollTo("transformations")}
              className="w-full sm:w-auto text-base font-medium text-white/70 hover:text-gold border border-white/15 hover:border-gold/40 px-10 py-[22px] rounded-full transition-all duration-300"
            >
              شاهد نتائجنا
            </button>
          </motion.div>

          {/* Stats — horizontal with dividers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center gap-0 divide-x divide-x-reverse divide-white/10"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex-1 text-center px-6 md:px-12 max-w-[200px]">
                <p className="text-3xl md:text-4xl font-black text-gradient-gold mb-1">{s.value}</p>
                <p className="text-xs text-white/40 tracking-wider uppercase">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-gold transition-colors"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">اكتشف</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}
