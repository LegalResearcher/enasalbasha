import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, Heart, Smile, Star, Shield, Crown, 
  Stethoscope, Syringe, Scan, Palette, Clock, BadgeCheck,
  ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";

// خريطة الأيقونات لربط اسم الأيقونة من قاعدة البيانات بالمكون الفعلي
const iconMap: { [key: string]: any } = {
  Sparkles, Heart, Smile, Star, Shield, Crown,
  Stethoscope, Syringe, Scan, Palette, Clock, BadgeCheck,
};

export function ServicesSection() {
  // جلب البيانات من Supabase
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="services" className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="container px-4 relative z-10">
        
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-bold tracking-wider text-sm mb-4 uppercase">
            خدماتنا المتميزة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">
            نقدم لك <span className="text-gold relative inline-block">
              أفضل الخدمات
              {/* خط زخرفي بسيط تحت الكلمة */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/30 rounded-full w-full"></span>
            </span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            خدمات شاملة لصحة وجمال أسنانك بأحدث التقنيات وبأيدي خبيرة
          </p>
        </motion.div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? // حالة التحميل (Skeleton)
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6" />
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
                </div>
              ))
            : // عرض الخدمات الفعلية
              services?.map((service, index) => {
                const IconComponent = iconMap[service.icon || "Sparkles"] || Sparkles;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/services/${service.id}`}
                      className="group block h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gold/20 relative overflow-hidden"
                    >
                      {/* تأثير الخلفية عند التحويم */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      
                      <div className="relative z-10">
                        {/* الأيقونة: تم تغيير الألوان لتكون كحلي وذهبي */}
                        <div className="w-16 h-16 rounded-2xl bg-navy/5 group-hover:bg-navy text-navy group-hover:text-gold flex items-center justify-center mb-6 transition-all duration-500 shadow-sm group-hover:shadow-gold/20 transform group-hover:-translate-y-1">
                          <IconComponent className="w-8 h-8 transition-colors duration-500" />
                        </div>

                        {/* العنوان والنص */}
                        <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors duration-300 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                          {service.description}
                        </p>

                        {/* زر اقرأ المزيد */}
                        <div className="flex items-center text-sm font-medium text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span>تفاصيل الخدمة</span>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

