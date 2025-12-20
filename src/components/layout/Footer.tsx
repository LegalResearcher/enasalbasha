export function Footer() {
  return (
    <footer className="bg-navy py-8 border-t border-gold/10">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Section - Enhanced with CSS filters for luxury look */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="شعار د. إيناس الباشا" 
              className="w-16 h-16 object-contain brightness-0 invert" 
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            
            <div>
              <h3 className="text-gold font-bold text-lg">د. إيناس الباشا</h3>
              <p className="text-gold/50 text-xs">طب وجراحة الفم والأسنان</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gold/70 text-sm">
              © 2025 الناصر تِك للحلول الرقمية (Alnasser Tech Digital Solutions)
            </p>
            <p className="text-gold/50 text-xs">جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

