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
  CheckCircle, Loader2, Sparkles, Gift, AlertCircle
} from "lucide-react";

const CLOSED_DAYS = [5]; // الجمعة

function getMinDate() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split("T")[0];
}

function validateDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (CLOSED_DAYS.includes(date.getDay())) {
    return "العيادة مغلقة يوم الجمعة. يرجى اختيار يوم آخر.";
  }
  return null;
}

export function BookingSection() {
  const { toast } = useToast();
  const [isConsultation, setIsConsultation] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", service_id: "", date: "", message: "",
  });
  const [dateError, setDateError] = useState<string | null>(null);

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services").select("id, title").eq("is_visible", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bookings").insert([{
        patient_name: formData.name,
        phone: formData.phone,
        service_id: isConsultation ? null : formData.service_id || null,
        preferred_date: formData.date || null,
        notes: isConsultation ? `[استشارة مجانية] ${formData.message}` : formData.message,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: isConsultation ? "تم طلب الاستشارة!" : "تم الحجز بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الموعد.",
        className: "bg-navy text-white border-gold",
      });
      setFormData({ name: "", phone: "", service_id: "", date: "", message: "" });
      setIsConsultation(false);
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى." });
    },
  });

  const handleDateChange = (val: string) => {
    setFormData({ ...formData, date: val });
    setDateError(validateDate(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "يرجى تعبئة البيانات الأساسية", variant: "destructive" });
      return;
    }
    if (dateError) { toast({ title: dateError, variant: "destructive" }); return; }
    bookingMutation.mutate();
  };

  return (
    <section id="booking" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy-light/50 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-right space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-gold font-bold tracking-wider text-sm mb-4 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-gold/10">
                <Sparkles className="w-3 h-3" /> حجز موعد جديد
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                ابدأ رحلتك نحو <br /><span className="text-gold">ابتسامة مثالية</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                احجز موعدك أو اطلب استشارة مجانية مع الدكتورة إيناس وسنتواصل معك في أقرب وقت.
              </p>
            </div>

            {/* بطاقة الاستشارة المجانية */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsConsultation(true)}
              className="cursor-pointer flex items-start gap-4 bg-gradient-to-r from-gold/20 to-gold/5 p-5 rounded-2xl border border-gold/30 hover:border-gold/60 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-gold" />
              </div>
              <div className="text-right">
                <p className="text-gold font-bold text-lg mb-1">استشارة مجانية 🎁</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  لست متأكداً من الخدمة المناسبة؟ اضغط هنا لطلب استشارة مجانية مع الدكتورة إيناس.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <a href="tel:774883898" className="flex items-center gap-4 bg-navy-light/50 p-4 rounded-2xl border border-white/5 group cursor-pointer hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center border border-gold/20 group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">اتصل بنا مباشرة</p>
                  <p className="text-lg font-bold text-white" dir="ltr">774 883 898</p>
                </div>
              </a>
              <div className="flex items-center gap-4 bg-navy-light/50 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center border border-gold/20">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">ساعات العمل</p>
                  <p className="text-base font-bold text-white">9:00 ص – 8:00 م</p>
                  <p className="text-[10px] text-gold mt-0.5">السبت – الخميس</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/30 relative overflow-hidden border border-white/10">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-gold-light" />

              {/* تبديل نوع الطلب */}
              <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => setIsConsultation(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isConsultation ? "bg-navy text-white shadow" : "text-gray-500 hover:text-navy"}`}>
                  حجز موعد
                </button>
                <button type="button" onClick={() => setIsConsultation(true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${isConsultation ? "bg-gold text-navy shadow" : "text-gray-500 hover:text-navy"}`}>
                  <Gift className="w-3.5 h-3.5" /> استشارة مجانية
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <User className="w-4 h-4 text-gold" /> الاسم الكامل
                  </label>
                  <Input required placeholder="الاسم الثلاثي"
                    className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" /> رقم الهاتف
                    </label>
                    <Input required type="tel" placeholder="077xxxxxxx"
                      className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-right text-navy"
                      dir="rtl" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" /> التاريخ المفضل
                    </label>
                    <Input type="date" min={getMinDate()}
                      className={`bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy ${dateError ? "border-red-400" : ""}`}
                      value={formData.date} onChange={(e) => handleDateChange(e.target.value)} />
                    {dateError && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {dateError}
                      </p>
                    )}
                  </div>
                </div>

                {!isConsultation && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gold" /> نوع الخدمة
                    </label>
                    <Select value={formData.service_id} onValueChange={(v) => setFormData({ ...formData, service_id: v })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 h-12 rounded-xl text-navy">
                        <SelectValue placeholder="اختر الخدمة المطلوبة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {services?.map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                        {!services && <SelectItem value="general">كشف عام</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gold" />
                    {isConsultation ? "ما الذي تودّ الاستفسار عنه؟" : "ملاحظات (اختياري)"}
                  </label>
                  <Textarea placeholder={isConsultation ? "اكتب استفسارك هنا..." : "أي تفاصيل إضافية؟"}
                    className="bg-gray-50 border-gray-200 focus:border-gold focus:ring-gold/20 rounded-xl text-navy"
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>

                <Button type="submit" disabled={bookingMutation.isPending || !!dateError}
                  className={`w-full font-bold h-14 text-lg rounded-xl shadow-lg transition-all duration-300 mt-6 ${isConsultation ? "bg-gold hover:bg-yellow-400 text-navy" : "bg-navy hover:bg-navy-light text-white border border-gold/20"}`}>
                  {bookingMutation.isPending ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" />جاري الإرسال...</>
                  ) : isConsultation ? (
                    <><Gift className="ml-2 h-5 w-5" />طلب استشارة مجانية</>
                  ) : "تأكيد طلب الحجز"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
