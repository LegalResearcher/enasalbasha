import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#services", label: "خدماتنا" },
  { href: "#transformations", label: "قصص نجاح" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#gallery", label: "المعرض" },
  { href: "#faq", label: "الأسئلة" },
  { href: "#contact", label: "تواصل معنا" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // نص الرسالة الاحترافية الجاهزة
  const whatsappMessage = encodeURIComponent(
    "السلام عليكم ورحمة الله،\nتواصلت معكم عبر الموقع الإلكتروني لعيادة د. إيناس الباشا.\nأرغب في الاستفسار عن حجز موعد."
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const elementId = id.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-navy/95 backdrop-blur-xl shadow-lg shadow-navy/20 border-b border-gold/10 py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* الشعار */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
          >
             <div className="flex flex-col">
               <span className="text-2xl font-bold text-white tracking-wide leading-none">
                 ENAS <span className="text-gold">CLINIC</span>
               </span>
               <span className="text-[10px] text-gray-300 tracking-widest uppercase opacity-80">
                 DENTAL CARE
               </span>
             </div>
          </div>

          {/* روابط الكمبيوتر */}
          <div className="hidden lg:flex items-center gap-6 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-gray-200 hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* أزرار الإجراءات */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* زر واتساب مع الرسالة الجاهزة */}
            <a 
              href={`https://wa.me/967774883898?text=${whatsappMessage}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              title="تواصل عبر واتساب"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <Button
              className="bg-gold hover:bg-gold-light text-navy font-bold rounded-full px-6 shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all transform hover:-translate-y-0.5"
              onClick={() => scrollToSection("#booking")}
            >
              <Phone className="w-4 h-4 ml-2" />
              حجز موعد
            </Button>
          </div>

          {/* زر قائمة الجوال */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-gold transition-colors"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-0 top-20 bg-navy z-40 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-8 space-y-2">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(link.href)}
                  className="w-full text-right py-4 text-xl font-bold text-white hover:text-gold border-b border-white/5 transition-colors flex justify-between items-center group"
                >
                  {link.label}
                  <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                </motion.button>
              ))}
              
              <div className="flex flex-col gap-4 pt-8 mt-4">
                <Button
                  className="w-full bg-gold hover:bg-gold-light text-navy font-bold h-12 text-lg rounded-xl"
                  onClick={() => scrollToSection("#booking")}
                >
                  <Phone className="w-5 h-5 ml-2" />
                  احجز موعدك الآن
                </Button>
                
                {/* زر واتساب الجوال مع الرسالة الجاهزة */}
                <a 
                  href={`https://wa.me/967774883898?text=${whatsappMessage}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 rounded-xl transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    تواصل عبر واتساب
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

