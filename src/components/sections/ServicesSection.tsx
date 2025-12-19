import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, Heart, Smile, Star, Shield, Crown, 
  Stethoscope, Syringe, Scan, Palette, Clock, BadgeCheck 
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: { [key: string]: any } = {
  Sparkles,
  Heart,
  Smile,
  Star,
  Shield,
  Crown,
  Stethoscope,
  Syringe,
  Scan,
  Palette,
  Clock,
  BadgeCheck,
};

export function ServicesSection() {
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
    <section id="services" className="py-24 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-teal font-medium mb-4">
            خدماتنا المتميزة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            نقدم لك <span className="text-gradient-teal">أفضل الخدمات</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            خدمات شاملة لصحة وجمال أسنانك بأحدث التقنيات وبأيدي خبيرة
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-8 animate-pulse"
                  >
                    <div className="w-16 h-16 bg-muted rounded-xl mb-6" />
                    <div className="h-6 bg-muted rounded mb-3 w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3 mt-2" />
                  </div>
                ))
            : services?.map((service, index) => {
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
                      className="group block bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border hover:border-teal/30 relative overflow-hidden"
                    >
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center mb-6 shadow-lg shadow-teal/20 group-hover:scale-110 transition-transform duration-500">
                          <IconComponent className="w-8 h-8 text-primary-foreground" />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-teal transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>

                        {/* Arrow */}
                        <div className="mt-6 flex items-center gap-2 text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">اعرف المزيد</span>
                          <svg
                            className="w-4 h-4 rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
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
