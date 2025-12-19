import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#services", label: "خدماتنا" },
  { href: "#transformations", label: "قبل وبعد" },
  { href: "#testimonials", label: "آراء المرضى" },
  { href: "#faq", label: "الأسئلة الشائعة" },
  { href: "#booking", label: "احجز موعدك" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
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
          ? "bg-navy/95 backdrop-blur-xl shadow-lg shadow-navy/20" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-lg shadow-gold/30">
              <span className="text-navy font-bold text-lg">د.إ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-gold font-bold text-lg leading-tight">
                د. إيناس الباشا
              </h1>
              <p className="text-gold/60 text-xs">طب وجراحة الفم والأسنان</p>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-gold/80 hover:text-gold transition-colors duration-300 text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="heroOutline"
              size="sm"
              className="gap-2"
              onClick={() => scrollToSection("#booking")}
            >
              <Phone className="w-4 h-4" />
              احجز الآن
            </Button>
            <Button
              variant="whatsapp"
              size="sm"
              className="gap-2"
              asChild
            >
              <a href="https://wa.me/967" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gold"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-dark/98 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-right py-3 text-gold/80 hover:text-gold border-b border-gold/10 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => scrollToSection("#booking")}
                >
                  <Phone className="w-4 h-4" />
                  احجز موعدك
                </Button>
                <Button variant="whatsapp" className="w-full" asChild>
                  <a href="https://wa.me/967" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" />
                    تواصل عبر واتساب
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
