import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Facebook, Instagram } from "lucide-react";

// مكون أيقونة واتساب الأصلية (SVG)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-navy relative overflow-hidden border-t border-white/5">
      {/* عناصر خلفية جمالية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container px-4 relative z-10">
        
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gold font-bold tracking-wider text-sm mb-3 block uppercase"
          >
            تواصل معنا
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            نحن هنا <span className="text-gold">لمساعدتك</span>
          </motion.h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            تواصل معنا عبر القنوات التالية، فريقنا جاهز للرد على استفساراتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* بطاقة العنوان */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-navy-light/30 backdrop-blur-md p-8 rounded-3xl border border-gold/10 hover:border-gold/30 transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-6 group-hover:bg-gold group-hover:text-navy transition-colors shadow-lg shadow-gold/5">
              <MapPin className="w-7 h-7 text-gold group-hover:text-navy" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">العنوان</h3>
            <p className="text-gray-400 leading-relaxed">
              صنعاء - شارع تعز<br />
              جنوب جسر دار سلم - قبل شارع الثلاثين<br />
              فوق صيدلية ابن حيان 17 - الدور الثالث
            </p>
          </motion.div>

          {/* بطاقة الهاتف وساعات العمل */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-navy-light/30 backdrop-blur-md p-8 rounded-3xl border border-gold/10 hover:border-gold/30 transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-6 group-hover:bg-gold group-hover:text-navy transition-colors shadow-lg shadow-gold/5">
              <Phone className="w-7 h-7 text-gold group-hover:text-navy" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">اتصل بنا</h3>
            
            <a 
              href="tel:774883898" 
              dir="ltr" 
              className="text-2xl font-bold text-gold hover:text-white transition-colors block mb-4"
            >
              774 883 898
            </a>
            
            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                <Clock className="w-4 h-4 text-gold" />
                <span>ساعات العمل:</span>
              </div>
              <p className="text-white font-medium">9:00 صباحاً - 8:00 مساءً</p>
              <p className="text-xs text-red-400 mt-1 font-bold">الجمعة مغلق</p>
            </div>
          </motion.div>

          {/* بطاقة التواصل الاجتماعي */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-navy-light/30 backdrop-blur-md p-8 rounded-3xl border border-gold/10 hover:border-gold/30 transition-all duration-300 group text-center"
          >
             <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-6 group-hover:bg-gold group-hover:text-navy transition-colors shadow-lg shadow-gold/5">
              <WhatsAppIcon />
            </div>
            <h3 className="text-xl font-bold text-white mb-6">تابعنا على</h3>
            
            <div className="flex justify-center gap-4">
              
              {/* واتساب - أيقونة أصلية */}
              <a 
                href="https://wa.me/967774883898" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg"
                title="تواصل عبر واتساب"
              >
                <WhatsAppIcon />
              </a>

              {/* فيسبوك */}
              <a 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-[#1877F2] hover:text-white text-gray-300 flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#1877F2]"
              >
                <Facebook className="w-6 h-6" />
              </a>

              {/* انستقرام - الحساب الرسمي */}
              <a 
                href="https://www.instagram.com/dr_enasalbasha?igsh=dDljZ3BweTM2aXg1" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white text-gray-300 flex items-center justify-center transition-all duration-300 border border-white/10"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-6">
              تابع أحدث حالاتنا وعروضنا الحصرية
            </p>
          </motion.div>

        </div>

        {/* خريطة جوجل - رابط دقيق لصيدلية ابن حيان 17/العيادة */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden border border-gold/20 shadow-2xl h-[350px] relative group"
        >
            <div className="absolute inset-0 bg-navy/20 pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10" />
            <iframe 
              src="https://maps.google.com/maps?q=15.2693779,44.2489205&hl=ar&z=17&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(10%) contrast(1.1)' }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع العيادة"
            ></iframe>
        </motion.div>

      </div>
    </section>
  );
}

