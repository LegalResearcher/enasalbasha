import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "✦ نقبل الآن مرضى جدد — استشارتك الأولى مجانية",
  "✦ عرض هذا الشهر: خصم 20% على تبييض الأسنان",
  "✦ العيادة مفتوحة السبت – الخميس من 9 ص حتى 8 م",
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;
  return (
    <div className="bg-[hsl(var(--navy-dark))] border-b border-gold/20 py-2 px-4 relative overflow-hidden z-[60]">
      {/* shimmer line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none" />
      <div className="container mx-auto flex items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-[0.15em] text-gold/90 font-medium text-center"
          >
            {messages[idx]}
          </motion.p>
        </AnimatePresence>
        <button
          onClick={() => setVisible(false)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
