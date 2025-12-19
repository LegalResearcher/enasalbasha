import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Clock, User, Phone, MessageSquare, 
  ChevronLeft, ChevronRight, Check, Loader2, Sparkles 
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

  const bookingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("bookings").insert([{
        ...data,
        service_id: data.service_id || null,
        preferred_date: data.preferred_date || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم الحجز بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الموعد",
      });
      setStep(4);
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 9) {
      setPhoneError("رقم الهاتف يجب أن يكون 9 أرقام (مثال: 7XXXXXXXX)");
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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="booking" className="py-24 bg-navy relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-medium mb-4">
            احجز موعدك
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            ابدأ رحلتك نحو <span className="text-gradient-gold">ابتسامة مثالية</span>
          </h2>
          <p className="text-gold/60 max-w-2xl mx-auto text-lg">
            احجز موعدك الآن في 3 خطوات بسيطة
          </p>
        </motion.div>

        {/* Booking Form */}
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s <= step
                      ? "bg-gold text-navy"
                      : "bg-navy-light text-gold/50"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 rounded-full transition-all duration-300 ${
                      s < step ? "bg-gold" : "bg-navy-light"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="bg-navy-light/50 backdrop-blur-xl rounded-3xl p-8 border border-gold/10">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Service */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                      اختر الخدمة
                    </h3>
                    <p className="text-gold/60">
                      اختر الخدمة التي تحتاجها (اختياري)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, service_id: "" })}
                      className={`p-4 rounded-xl border text-right transition-all duration-300 ${
                        formData.service_id === ""
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/20 text-gold/70 hover:border-gold/40"
                      }`}
                    >
                      كشف عام
                    </button>
                    {services?.map((service) => (
                      <button
                        key={service.id}
                        onClick={() =>
                          setFormData({ ...formData, service_id: service.id })
                        }
                        className={`p-4 rounded-xl border text-right transition-all duration-300 ${
                          formData.service_id === service.id
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-gold/20 text-gold/70 hover:border-gold/40"
                        }`}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                      اختر الموعد
                    </h3>
                    <p className="text-gold/60">
                      حدد التاريخ والوقت المناسب لك
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gold mb-2 text-sm">
                        التاريخ المفضل
                      </label>
                      <Input
                        type="date"
                        min={today}
                        value={formData.preferred_date}
                        onChange={(e) =>
                          setFormData({ ...formData, preferred_date: e.target.value })
                        }
                        className="bg-navy border-gold/20 text-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-gold mb-2 text-sm">
                        الوقت المفضل
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() =>
                              setFormData({ ...formData, preferred_time: time })
                            }
                            className={`p-2 rounded-lg text-sm transition-all duration-300 ${
                              formData.preferred_time === time
                                ? "bg-gold text-navy font-bold"
                                : "bg-navy border border-gold/20 text-gold/70 hover:border-gold/40"
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

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <User className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                      معلومات التواصل
                    </h3>
                    <p className="text-gold/60">
                      أدخل بياناتك للتواصل معك
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gold mb-2 text-sm">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                        <Input
                          value={formData.patient_name}
                          onChange={(e) =>
                            setFormData({ ...formData, patient_name: e.target.value })
                          }
                          placeholder="أدخل اسمك الكامل"
                          className="bg-navy border-gold/20 text-gold pr-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gold mb-2 text-sm">
                        رقم الهاتف * (9 أرقام)
                      </label>
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
                          className="bg-navy border-gold/20 text-gold pr-11 tracking-wider"
                          dir="ltr"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-destructive text-sm mt-1">{phoneError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gold mb-2 text-sm">
                        ملاحظات إضافية
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gold/50" />
                        <Textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          placeholder="أي معلومات إضافية تود إخبارنا بها..."
                          className="bg-navy border-gold/20 text-gold pr-11 min-h-24"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-teal flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                    تم الحجز بنجاح!
                  </h3>
                  <p className="text-gold/60 mb-8">
                    شكراً لك، سنتواصل معك قريباً لتأكيد الموعد
                  </p>
                  <Button
                    variant="hero"
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
                    حجز موعد جديد
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="text-gold hover:text-gold/80"
                >
                  <ChevronRight className="w-5 h-5 ml-2" />
                  السابق
                </Button>
                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : step === 3 ? (
                    "تأكيد الحجز"
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
