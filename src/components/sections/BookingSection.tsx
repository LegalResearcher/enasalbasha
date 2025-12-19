import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"; // تأكد من مسار use-toast الصحيح في مشروعك
import { 
  Calendar, User, Phone, MessageSquare, 
  ChevronLeft, ChevronRight, Check, Loader2, Sparkles, Clock 
} from "lucide-react";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

export function BookingSection() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service_id: "",
    preferred_date: "",
    preferred_time: "",
    patient_name: "",
    phone: "",
    notes: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const { toast } = useToast();

  // جلب الخدمات من قاعدة البيانات
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

  // إرسال الحجز
  const bookingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("appointments").insert([{ // تأكد أن اسم الجدولappointments أو bookings حسب قاعدتك
        full_name: data.patient_name,
        phone_number: data.phone,
        service_type: data.service_id, // أو title حسب هيكل الجدول
        preferred_date: `${data.preferred_date} ${data.preferred_time}`,
        notes: data.notes,
        status: 'pending'
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم الحجز بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الموعد.",
        className: "bg-navy text-white border-gold",
      });
      setStep(4);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  // التحقق من صحة رقم الهاتف اليمني
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 9) {
      setPhoneError("رقم الهاتف يجب أن يكون 9 أرقام");
      return false;
    }
    if (!cleaned.startsWith("7")) {
      setPhoneError("رقم الهاتف يجب أن يبدأ بـ 7");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
       if (!formData.preferred_date || !formData.preferred_time) {
         toast({ title: "يرجى اختيار التاريخ والوقت", variant: "destructive" });
         return;
       }
    }
    if (step === 3) {
      if (!formData.patient_name.trim()) {
        toast({ title: "يرجى إدخال الاسم", variant: "destructive" });
        return;
      }
      if (!validatePhone(formData.phone)) {
        return;
      }
      bookingMutation.mutate(formData);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  // الحصول على تاريخ اليوم
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="booking" className="py-24 bg-navy relative overflow-hidden">
      {/* خلفية جمالية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-light/20 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-bold tracking-wider text-sm mb-4 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-gold/10">
            احجز موعدك
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            خطوات بسيطة نحو <span className="text-gold">ابتسامة مثالية</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            قم بحجز موعدك الآن خلال دقيقة واحدة
          </p>
        </motion.div>

        {/* نموذج الحجز (Wizard) */}
        <div className="max-w-3xl mx-auto">
          {/* شريط التقدم */}
          <div className="flex items-center justify-center gap-4 mb-12" dir="rtl">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
                    s <= step
                      ? "bg-gold border-gold text-navy shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                      : "bg-transparent border-white/10 text-gray-500"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 sm:w-20 h-1 rounded-full transition-all duration-500 ${
                      s < step ? "bg-gold" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* محتوى الخطوات */}
          <div className="bg-navy-light/30 backdrop-blur-md rounded-[2rem] p-6 sm:p-10 border border-gold/10 shadow-2xl relative overflow-hidden">
            {/* شريط علوي ذهبي */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-white/50 to-gold opacity-50" />

            <AnimatePresence mode="wait">
              {/* الخطوة 1: اختيار الخدمة */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-4 shadow-lg shadow-gold/5">
                        <Sparkles className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">اختر الخدمة المطلوبة</h3>
                    <p className="text-gray-400">حدد نوع العلاج الذي تبحث عنه</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, service_id: "كشف عام" })}
                      className={`p-5 rounded-xl border text-right transition-all duration-300 flex items-center justify-between group ${
                        formData.service_id === "كشف عام"
                          ? "border-gold bg-gold text-navy font-bold shadow-lg shadow-gold/20"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-gold/50 hover:bg-white/10"
                      }`}
                    >
                      <span>كشف عام / استشارة</span>
                      {formData.service_id === "كشف عام" && <Check className="w-5 h-5" />}
                    </button>
                    {services?.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setFormData({ ...formData, service_id: service.title })} // استخدام العنوان أو الـ ID حسب الحاجة
                        className={`p-5 rounded-xl border text-right transition-all duration-300 flex items-center justify-between group ${
                          formData.service_id === service.title
                            ? "border-gold bg-gold text-navy font-bold shadow-lg shadow-gold/20"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-gold/50 hover:bg-white/10"
                        }`}
                      >
                        <span>{service.title}</span>
                        {formData.service_id === service.title && <Check className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* الخطوة 2: التاريخ والوقت */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-4 shadow-lg shadow-gold/5">
                        <Calendar className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">اختر الموعد المناسب</h3>
                    <p className="text-gray-400">حدد اليوم والساعة التي تفضلها</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gold mb-3 text-sm font-bold">التاريخ المفضل</label>
                      <Input
                        type="date"
                        min={today}
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        className="bg-navy border-gold/20 text-white h-12 focus:ring-gold/30 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-gold mb-3 text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> الوقت المفضل
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData({ ...formData, preferred_time: time })}
                            className={`py-2 px-1 rounded-lg text-sm transition-all duration-300 border ${
                              formData.preferred_time === time
                                ? "bg-gold border-gold text-navy font-bold shadow-md"
                                : "bg-navy border-white/10 text-gray-400 hover:border-gold/50 hover:text-white"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* الخطوة 3: بيانات التواصل */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-navy rounded-full flex items-center justify-center border border-gold/20 mb-4 shadow-lg shadow-gold/5">
                        <User className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">معلومات التواصل</h3>
                    <p className="text-gray-400">كيف يمكننا الاتصال بك لتأكيد الحجز؟</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-gold mb-2 text-sm font-bold">الاسم الكامل *</label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                        <Input
                          value={formData.patient_name}
                          onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                          placeholder="الاسم الثلاثي"
                          className="bg-navy border-gold/20 text-white pr-10 h-12 focus:ring-gold/30 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gold mb-2 text-sm font-bold">رقم الهاتف * (يمن موبايل / سبأفون..)</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                            setFormData({ ...formData, phone: value });
                            if (value.length === 9) validatePhone(value);
                          }}
                          placeholder="7XXXXXXXX"
                          className="bg-navy border-gold/20 text-white pr-10 h-12 tracking-wider focus:ring-gold/30 rounded-xl"
                          dir="ltr" // لجعل الأرقام تكتب من اليسار
                          style={{ textAlign: 'right' }} // محاذاة النص لليمين
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-400 block" /> {phoneError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gold mb-2 text-sm font-bold">ملاحظات إضافية (اختياري)</label>
                      <div className="relative">
                        <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gold/50" />
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="هل لديك أي حالة صحية أو استفسار؟"
                          className="bg-navy border-gold/20 text-white pr-10 min-h-24 focus:ring-gold/30 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* الخطوة 4: شاشة النجاح */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gold flex items-center justify-center mb-8 shadow-2xl shadow-gold/30 animate-pulse">
                    <Check className="w-12 h-12 text-navy" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    تم استلام طلبك!
                  </h3>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    شكراً لاختيارك عيادتنا. سيقوم فريق الاستقبال بالتواصل معك<br/>
                    خلال الساعات القادمة لتأكيد الموعد النهائي.
                  </p>
                  <Button
                    className="bg-navy hover:bg-navy-dark border border-gold/30 text-gold px-8 py-6 rounded-xl text-lg font-bold"
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        service_id: "",
                        preferred_date: "",
                        preferred_time: "",
                        patient_name: "",
                        phone: "",
                        notes: "",
                      });
                    }}
                  >
                    حجز موعد آخر
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* أزرار التنقل السفلية */}
            {step < 4 && (
              <div className="flex justify-between mt-12 pt-8 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`text-gray-400 hover:text-white hover:bg-white/5 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  <ChevronRight className="w-5 h-5 ml-2" />
                  السابق
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={bookingMutation.isPending}
                  className="bg-gold hover:bg-gold-light text-navy font-bold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {bookingMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : step === 3 ? (
                    "تأكيد وإرسال"
                  ) : (
                    <>
                      التالي
                      <ChevronLeft className="w-5 h-5 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

