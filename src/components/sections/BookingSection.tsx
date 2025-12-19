import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Clock, Phone, User, MessageSquare, 
  CheckCircle, Loader2, Sparkles 
} from "lucide-react";

export function BookingSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_id: "",
    date: "",
    message: "",
  });

  // 1. جلب قائمة الخدمات من قاعدة البيانات (نفس منطق الكود القديم)
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // 2. دالة إرسال الحجز (تم تعديلها لتطابق جدول bookings القديم)
  const bookingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bookings").insert([
        {
          patient_name: formData.name,      // تم التصحيح: patient_name بدلاً من full_name
          phone: formData.phone,            // تم التصحيح: phone بدلاً من phone_number
          service_id: formData.service_id,  // تم التصحيح: إرسال ID الخدمة
          preferred_date: formData.date,    // التاريخ
          notes: formData.message,          // الملاحظات
          // preferred_time: يمكن إضافته إذا أردت، حالياً نكتفي بالتاريخ في هذا التصميم
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم الحجز بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الموعد.",
        className: "bg-navy text-white border-gold",
      });
      // تصفير النموذج
      setFormData({ name: "", phone: "", service_id: "", date: "", message: "" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى أو التأكد من الاتصال.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "يرجى تعبئة البيانات الأساسية", variant: "destructive" });
      return;
    }
    bookingMutation.mutate();
  };

  return (
    <section id="booking" className="py-24 bg-navy relative overflow-hidden">
      {/* عناصر خلفية جمالية */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy-light/50 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* الجانب الأيمن: نصوص ترحيبية ومعلومات */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right space-y-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-gold font-bold tracking-wider text-sm mb-4 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-gold/10">
                <Sparkles className="w-3 h-3" />
                حجز موعد جديد
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                ابدأ رحلتك نحو <br />
                <span className="text-gold">ابتسامة مثالية</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                املأ النموذج البسيط وسنقوم بالتواصل معك لتحديد الموعد الأنسب. 
                استشارتك الأولى هي الخطوة الأهم نحو الثقة التي تستحقها.
              </p>
            </div>

            {/* معلومات التواصل السريع */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-4 bg-navy-light/50 p-4 rounded-2xl border border-white/5 group cursor-pointer hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center border border-gold/20 group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">اتصل بنا مباشرة</p>
                  <p className="text-lg font-bold text-white" dir="ltr">777 000 000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-navy-light/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center border border-gold/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">ساعات العمل</p>
                  <p className="text-lg font-bold text-white">9:00 ص - 9:00 م</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* الجانب الأيسر: نموذج الحجز (بطاقة بيضاء أنيقة) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/30 relative overflow-hidden border border-white/10">
              {/* شريط ذهبي علوي */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-gold-light" />
              
              <h3 className="text-2xl font-bold text-navy mb-8 flex items-center gap-2">
                بيانات الحجز
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* الاسم */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <User className="w-4 h-4 text-gold" /> الاسم الكامل
                  </label>
                  <Input
                    required
                    placeholder="الاسم الثلاثي"
                    className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* الهاتف والتاريخ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" /> رقم الهاتف
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="077xxxxxxx"
                      className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-right text-navy"
                      dir="rtl"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" /> التاريخ المفضل
                    </label>
                    <Input
                      type="date"
                      className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                {/* القائمة المنسدلة للخدمات (ديناميكية من قاعدة البيانات) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" /> نوع الخدمة
                  </label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy">
                      <SelectValue placeholder="اختر الخدمة المطلوبة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                      {!services && <SelectItem value="general">كشف عام</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                {/* الملاحظات */}
                <div className="space-y-2">
                   <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gold" /> ملاحظات (اختياري)
                  </label>
                  <Textarea
                    placeholder="أي تفاصيل إضافية؟"
                    className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-xl text-navy"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* زر الإرسال */}
                <Button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full bg-navy hover:bg-navy-light text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-navy/20 hover:shadow-xl transition-all duration-300 mt-6 border border-gold/20"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "تأكيد طلب الحجز"
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

