import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Phone, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const scrollToBooking = () => {
    window.location.href = "/#booking";
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-navy-light/40 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* الرقم 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <span className="text-[120px] md:text-[160px] font-black leading-none bg-gradient-to-b from-gold to-gold/30 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        {/* أيقونة الأسنان */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-5xl mb-6"
        >
          🦷
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          هذه الصفحة ليست هنا!
        </h1>
        <p className="text-gray-400 text-lg mb-3 leading-relaxed">
          يبدو أن هذا الرابط اختفى مثل ألم الأسنان بعد زيارة العيادة 😄
        </p>
        <p className="text-gray-500 text-sm mb-10">
          لا تقلق، يمكنك العودة للصفحة الرئيسية أو حجز موعدك مباشرة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 bg-gold hover:bg-yellow-400 text-navy font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </a>
          <button
            onClick={scrollToBooking}
            className="flex items-center gap-2 border border-gold/30 text-gold hover:bg-gold/10 font-bold px-8 py-3.5 rounded-full transition-all w-full sm:w-auto justify-center"
          >
            <Phone className="w-5 h-5" />
            احجز موعداً
          </button>
        </div>

        {/* شعار صغير في الأسفل */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-40">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-gray-400 text-sm">عيادة د. إيناس الباشا</span>
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
