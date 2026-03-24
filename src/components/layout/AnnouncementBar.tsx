import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Phone } from "lucide-react";

const announcements = [
  { text: "🎉 نقبل الآن مرضى جدد — احجز استشارتك المجانية اليوم", cta: "احجز الآن", ctaTarget: "booking" },
  { text: "✨ عرض خاص هذا الشهر: خصم 20% على تبييض الأسنان", cta: "تفاصيل", ctaTarget: "services" },
  { text: "📍 العيادة تعمل السبت إلى الخميس من 9 صباحاً حتى 8 مساءً", cta: null, ctaTarget: null },
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  const current = announcements[index];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-navy relative overflow-hidden z-[60]"
      >
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* تبديل الإعلان */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm font-bold truncate"
              >
                {current.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {current.cta && current.ctaTarget && (
              <button
                onClick={() => scrollTo(current.ctaTarget!)}
                className="text-xs font-black bg-navy text-gold px-3 py-1 rounded-full hover:bg-navy/80 transition-colors whitespace-nowrap"
              >
                {current.cta}
              </button>
            )}

            {/* أزرار التنقل */}
            <div className="flex gap-1">
              {announcements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-navy w-4" : "bg-navy/40"}`}
                />
              ))}
            </div>

            <button
              onClick={() => setVisible(false)}
              className="p-0.5 hover:opacity-70 transition-opacity"
              aria-label="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
