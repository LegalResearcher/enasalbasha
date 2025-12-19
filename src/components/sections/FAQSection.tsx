import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  if (isLoading) {
    return (
      <section id="faq" className="py-24 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!faqs?.length) {
    return null;
  }

  return (
    <section id="faq" className="py-24 bg-background">
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
            أسئلة شائعة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            الأسئلة <span className="text-gradient-teal">الأكثر تكراراً</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            إجابات على استفساراتكم الشائعة حول خدماتنا وعلاجاتنا
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card rounded-2xl border border-border px-6 data-[state=open]:border-teal/50 transition-colors"
              >
                <AccordionTrigger className="text-right py-6 text-lg font-medium hover:text-teal transition-colors [&[data-state=open]]:text-teal">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
