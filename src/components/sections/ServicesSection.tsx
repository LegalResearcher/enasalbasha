import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, Heart, Smile, Star, Shield, Crown,
  Stethoscope, Syringe, Scan, Palette, Clock, BadgeCheck, ArrowUpLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: { [key: string]: any } = {
  Sparkles, Heart, Smile, Star, Shield, Crown,
  Stethoscope, Syringe, Scan, Palette, Clock, BadgeCheck,
};

export function ServicesSection() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services").select("*").eq("is_visible", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="services" className="py-32 bg-[hsl(var(--cream))] relative overflow-hidden">
      {/* Big decorative number */}
      <div className="absolute -top-8 left-8 text-[160px] font-black text-navy/[0.03] leading-none select-none pointer-events-none">01</div>

      <div className="container px-6">
        {/* Header — left-aligned for variety */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="gold-line" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">خدماتنا المتميزة</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-navy leading-tight max-w-xl">
            رعاية شاملة<br />
            <span className="text-gradient-gold">لأسنان مثالية</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg max-w-md leading-relaxed">
            أحدث التقنيات وأعلى معايير الجودة في كل خدمة نقدمها
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 animate-pulse h-64">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl mb-5" />
                  <div className="h-5 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))
            : services?.map((service, i) => {
                const Icon = iconMap[service.icon || "Sparkles"] || Sparkles;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <Link
                      to={`/services/${service.id}`}
                      className="group flex flex-col h-full bg-white rounded-2xl p-8 border border-transparent hover:border-gold/20 transition-all duration-500 card-lift relative overflow-hidden"
                    >
                      {/* Top accent line on hover */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                      <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cream))] group-hover:bg-navy flex items-center justify-center mb-6 transition-all duration-500">
                        <Icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors duration-500" />
                      </div>

                      <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-1 mt-6 text-xs font-bold text-gold/0 group-hover:text-gold transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        تفاصيل الخدمة
                        <ArrowUpLeft className="w-3.5 h-3.5" />
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
