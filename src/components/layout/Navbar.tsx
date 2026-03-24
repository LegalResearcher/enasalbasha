import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

const navLinks = [
  { href: "hero", label: "الرئيسية" },
  { href: "services", label: "خدماتنا" },
  { href: "transformations", label: "نتائجنا" },
  { href: "testimonials", label: "آراء المرضى" },
  { href: "blog", label: "المقالات" },
  { href: "contact", label: "تواصل معنا" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const msg = encodeURIComponent("السلام عليكم،\nأود الاستفسار عن حجز موعد في عيادة د. إيناس الباشا.");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[hsl(var(--navy-dark))]/95 backdrop-blur-2xl border-b border-gold/10 py-0"
          : "bg-transparent py-2"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex flex-col items-start group">
            <span className="text-xl font-bold tracking-[0.12em] text-white uppercase">
              Enas <span className="text-gradient-gold">Clinic</span>
            </span>
            <span className="text-[9px] tracking-[0.3em] text-gold/50 uppercase mt-0.5">Dental Excellence</span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-[13px] tracking-wide text-white/70 hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 right-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/967774883898?text=${msg}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gold/30 text-gold/70 hover:text-gold hover:border-gold flex items-center justify-center transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button
              onClick={() => scrollTo("booking")}
              className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              احجز موعدك
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-white/80 hover:text-gold transition-colors p-2">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-0 top-20 bg-[hsl(var(--navy-dark))] overflow-hidden"
          >
            <div className="container px-6 py-12 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-right py-4 text-2xl font-light text-white/80 hover:text-gold border-b border-white/5 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 pt-10"
              >
                <button
                  onClick={() => scrollTo("booking")}
                  className="w-full bg-gold text-navy font-bold h-14 rounded-full text-lg"
                >
                  احجز موعدك الآن
                </button>
                <a
                  href={`https://wa.me/967774883898?text=${msg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-gold/30 text-gold h-14 rounded-full text-base font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
