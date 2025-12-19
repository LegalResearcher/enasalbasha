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
import { useToast } from "@/components/ui/use-toast"; // تأكد من مسار التوست
import { 
  Calendar, Clock, Phone, User, MessageSquare, 
  CheckCircle, Loader2, Sparkles 
} from "lucide-react";

// قائمة خدمات ثابتة تظهر في حال فشل جلب البيانات من السيرفر
const STATIC_SERVICES = [
  { id: "general", title: "كشف عام / استشارة" },
  { id: "hollywood", title: "ابتسامة هوليود" },
  { id: "implants", title: "زراعة الأسنان" },
  { id: "ortho", title: "تقويم الأسنان" },
  { id: "whitening", title: "تبييض الأسنان" },
  { id: "root", title: "علاج الجذور / العصب" },
  { id: "veneers", title: "عدسات (فينير)" },
  { id: "kids", title: "طب أسنان الأطفال" },
];

export function BookingSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_id: "",
    date: "",
    message: "",
  });

  // 1. محاولة جلب الخدمات من قاعدة البيانات
  const { data: dbServices } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_visible", true)
        .order("display_order");
      
      if (error) {
        console.error("Error fetching services:", error);
        return [];
      }
      return data;
    },
  });

  // دمج الخدمات: نستخدم القائمة من القاعدة، وإذا كانت فارغة نستخدم القائمة الثابتة
  const servicesList = (dbServices && dbServices.length > 0) ? dbServices : STATIC_SERVICES;

  // 2. دالة إرسال الحجز (تم ضبطها لتطابق جدول bookings القديم)
  const bookingMutation = useMutation({
    mutationFn: async () => {
      console.log("Sending data to bookings table...", formData);
      
      const { error } = await supabase.from("bookings").insert([
        {
          patient_name: formData.name,       // الاسم كما في الكود القديم
          phone: formData.phone,             // الهاتف كما في الكود القديم
          service_id: formData.service_id,   // معرف الخدمة
          preferred_date: formData.date,     // التاريخ
          notes: formData.message,           // الملاحظات
          // status: "pending"               // يمكن إضافته إذا كان العمود موجوداً
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error); // سيظهر تفاصيل الخطأ في الكونسول
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "تم الحجز بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الموعد.",
        className: "bg-navy text-white border-gold",
      });
      setFormData({ name: "", phone: "", service_id: "", date: "", message: "" });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "حدث خطأ في الحجز",
        description: error.message || "يرجى المحاولة مرة أخرى أو الاتصال بنا.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "يرجى تعبئة الاسم ورقم الهاتف", variant: "destructive" });
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
          
          {/* الجانب الأيمن: نصوص ترحيبية */}
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
              </p>
            </div>

            {/* معلومات التواصل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-4 bg-navy-light/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center border border-gold/20">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">اتصل بنا</p>
                  <p className="text-lg font-bold text-white" dir="ltr">777 000 000</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* الجانب الأيسر: النموذج */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
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
                    className="bg-gray-50 border-gray-200 focus:border-gold h-12 rounded-xl text-navy"
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
                      className="bg-gray-50 border-gray-200 focus:border-gold h-12 rounded-xl text-right text-navy"
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
                      className="bg-gray-50 border-gray-200 focus:border-gold h-12 rounded-xl text-navy"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                {/* نوع الخدمة */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" /> نوع الخدمة
                  </label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-gold h-12 rounded-xl text-navy">
                      <SelectValue placeholder="اختر الخدمة المطلوبة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {/* عرض الخدمات (سواء من القاعدة أو الثابتة) */}
                      {servicesList.map((service) => (
                        <SelectItem key={service.id} value={service.title || service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ملاحظات */}
                <div className="space-y-2">
                   <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gold" /> ملاحظات (اختياري)
                  </label>
                  <Textarea
                    placeholder="أي تفاصيل إضافية؟"
                    className="bg-gray-50 border-gray-200 focus:border-gold rounded-xl text-navy"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* زر الإرسال */}
                <Button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full bg-navy hover:bg-navy-light text-white font-bold h-14 text-lg rounded-xl shadow-lg mt-6 border border-gold/20"
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

