import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";

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
          
          {/* هنا كان الخطأ، تم التصحيح بإغلاق الوسم بشكل صحيح */}
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
              صنعاء - جنوب جسر دار سلم<br />
              قبل شارع الثلاثين<br />
              فوق صيدلية ابن حيان - الدور الثالث
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
            
            <a href="tel:774883898" className="text-2xl font-bold text-gold hover:text-white transition-colors dir-ltr block mb-4">
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
              <MessageCircle className="w-7 h-7 text-gold group-hover:text-navy" />
            </div>
            <h3 className="text-xl font-bold text-white mb-6">تابعنا على</h3>
            
            <div className="flex justify-center gap-4">
              {/* واتساب */}
              <a href="https://wa.me/967774883898" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gold hover:text-navy text-gray-300 flex items-center justify-center transition-all duration-300 border border-white/10">
                <MessageCircle className="w-6 h-6" />
              </a>
              {/* فيسبوك */}
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gold hover:text-navy text-gray-300 flex items-center justify-center transition-all duration-300 border border-white/10">
                <Facebook className="w-6 h-6" />
              </a>
              {/* انستقرام */}
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gold hover:text-navy text-gray-300 flex items-center justify-center transition-all duration-300 border border-white/10">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-6">
              تابع أحدث حالاتنا وعروضنا الحصرية
            </p>
          </motion.div>

        </div>

        {/* خريطة جوجل */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden border border-gold/20 shadow-2xl h-[350px] relative group"
        >
            <div className="absolute inset-0 bg-navy/20 pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10" />
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3848.468200673415!2d44.223896!3d15.295287!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDE3JzQzLjAiTiA0NMKwMTMnMjYuMCJF!5e0!3m2!1sar!2s!4v1650000000000!5m2!1sar!2s"
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

