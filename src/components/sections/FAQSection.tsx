import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles } from "lucide-react";

export function FAQSection() {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      {/* خلفية جمالية خفيفة جداً */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* الجانب الأيمن: العنوان والوصف (يأخذ 5 أعمدة) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5 border border-navy/10 text-navy font-bold text-sm mb-6">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span>الأسئلة الشائعة</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
              كل ما يهمك <br />
              <span className="text-gold relative">
                معرفته
                <span className="absolute -bottom-2 right-0 w-full h-1 bg-gold/30 rounded-full"></span>
              </span>
            </h2>
            
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              جمعنا لك الإجابات الدقيقة لأكثر الأسئلة شيوعاً حول علاجات الأسنان، 
              لتكون مطمئناً وتملك المعلومة الكاملة قبل زيارتنا.
            </p>

            {/* بطاقة دعوية صغيرة للتواصل */}
            <div className="bg-navy p-6 rounded-2xl text-white shadow-xl shadow-navy/20 relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              <Sparkles className="w-8 h-8 text-gold mb-4" />
              <h4 className="font-bold text-xl mb-2">لم تجد إجابتك؟</h4>
              <p className="text-gray-300 text-sm mb-4">فريقنا جاهز للرد على جميع استفساراتك مباشرة</p>
              <button className="text-gold text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                تواصل معنا الآن <span>&larr;</span>
              </button>
            </div>
          </motion.div>

          {/* الجانب الأيسر: قائمة الأسئلة (يأخذ 7 أعمدة) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            {isLoading ? (
              // حالة التحميل
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs?.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-gray-100 bg-white shadow-sm rounded-2xl px-6 py-2 hover:shadow-md transition-all duration-300 data-[state=open]:border-gold/30 data-[state=open]:shadow-gold/5"
                  >
                    <AccordionTrigger className="text-navy hover:text-gold hover:no-underline font-bold text-lg text-right py-5 [&[data-state=open]]:text-gold transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed text-base pb-6 pt-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

