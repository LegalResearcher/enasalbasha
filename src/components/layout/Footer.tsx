export function Footer() {
  return (
    <footer className="bg-navy py-8 border-t border-gold/10">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* حجم أكبر مع خاصية الدمج لإخفاء البياض */}
            <img 
              src="/logo.png" 
              alt="شعار د. إيناس الباشا" 
              className="w-20 h-20 object-contain" 
              style={{ mixBlendMode: 'multiply' }} 
            />
            
            <div>
              <h3 className="text-gold font-bold text-xl tracking-tight">د. إيناس الباشا</h3>
              <p className="text-gold/60 text-sm">طب وجراحة الفم والأسنان</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gold/70 text-sm font-medium">
              © 2025 الناصر تِك للحلول الرقمية
            </p>
            <p className="text-gold/40 text-xs mt-1">Alnasser Tech Digital Solutions</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

