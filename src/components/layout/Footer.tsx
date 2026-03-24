import { Phone, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "hero" },
  { label: "خدماتنا", href: "services" },
  { label: "نتائجنا", href: "transformations" },
  { label: "آراء المرضى", href: "testimonials" },
  { label: "مقالات طبية", href: "blog" },
  { label: "احجز موعداً", href: "booking" },
];

const WhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const msg = encodeURIComponent("السلام عليكم،\nأود الاستفسار عن حجز موعد في عيادة د. إيناس الباشا.");

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--navy-dark))] border-t border-white/5">
      <div className="container px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <div className="mb-6">
            <p className="text-xl font-bold tracking-[0.12em] text-white uppercase mb-1">
              Enas <span className="text-gradient-gold">Clinic</span>
            </p>
            <p className="text-[10px] tracking-[0.3em] text-gold/40 uppercase">Dental Excellence</p>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            التميز في طب وجراحة الفم والأسنان. ابتسامة مثالية بأيدي خبيرة.
          </p>
          {/* Social */}
          <div className="flex gap-3">
            <a
              href={`https://wa.me/967774883898?text=${msg}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-[#25D366] hover:text-[#25D366] flex items-center justify-center transition-all duration-300"
            >
              <WhatsApp />
            </a>
            <a
              href="https://www.instagram.com/dr_enasalbasha"
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-pink-400 hover:text-pink-400 flex items-center justify-center transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center transition-all duration-300"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold/60 mb-6 font-medium">روابط سريعة</p>
          <div className="grid grid-cols-2 gap-y-3">
            {navLinks.map(l => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-right text-sm text-white/40 hover:text-gold transition-colors duration-300"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gold/60 mb-6 font-medium">تواصل معنا</p>
          <div className="space-y-4">
            <a href="tel:774883898" className="flex items-center gap-3 text-white/40 hover:text-gold transition-colors duration-300 group">
              <Phone className="w-4 h-4 shrink-0 group-hover:text-gold" />
              <span className="text-sm" dir="ltr">774 883 898</span>
            </a>
            <div className="flex items-start gap-3 text-white/40">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">صنعاء — شارع تعز، جنوب جسر دار سلم</span>
            </div>
            <div className="flex items-center gap-3 text-white/40">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-sm">السبت – الخميس: 9 ص – 8 م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5">
        <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">© 2025 الناصر تِك للحلول الرقمية — Alnasser Tech</p>
          <p className="text-white/15 text-xs">جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
