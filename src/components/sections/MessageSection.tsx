import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const messageSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(100, "الاسم طويل جداً"),
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف طويل جداً"),
  email: z.string().trim().email("البريد الإلكتروني غير صالح").max(255).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "الموضوع مطلوب").max(200, "الموضوع طويل جداً"),
  message: z.string().trim().min(1, "الرسالة مطلوبة").max(2000, "الرسالة طويلة جداً"),
});

const MessageSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = messageSchema.parse(formData);

      const { error } = await supabase.from("messages").insert({
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        subject: validated.subject,
        message: validated.message,
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      });

      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "خطأ في البيانات",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ",
          description: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="message" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              أرسل لنا رسالة
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            هل لديك استفسار؟ أرسل لنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground text-right block">
                الاسم الكامل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                className="text-right bg-card border-border"
                dir="rtl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground text-right block">
                رقم الهاتف <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="967xxxxxxxxx"
                className="text-right bg-card border-border"
                dir="rtl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-right block">
                البريد الإلكتروني (اختياري)
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="text-right bg-card border-border"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground text-right block">
                الموضوع <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="موضوع الرسالة"
                className="text-right bg-card border-border"
                dir="rtl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground text-right block">
                الرسالة <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب رسالتك هنا..."
                className="text-right bg-card border-border min-h-[150px]"
                dir="rtl"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
            >
              {isSubmitting ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الرسالة
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default MessageSection;
