import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy py-8 border-t border-gold/10">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-navy font-bold">د.إ</span>
            </div>
            <div>
              <h3 className="text-gold font-bold">د. إيناس الباشا</h3>
              <p className="text-gold/50 text-xs">طب وجراحة الفم والأسنان</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-gold/50 text-sm flex items-center gap-1">
            جميع الحقوق محفوظة © {currentYear} - صُنع بـ
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            في اليمن
          </p>
        </div>
      </div>
    </footer>
  );
}
