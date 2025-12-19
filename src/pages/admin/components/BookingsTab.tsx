import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Calendar, Clock, Check, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type Booking = {
  id: string;
  patient_name: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
  service_id: string | null;
  services?: { title: string } | null;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-teal/20 text-teal",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "خطأ في تحميل الحجوزات", variant: "destructive" });
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    } else {
      toast({ title: "تم تحديث الحالة" });
      fetchBookings();
    }
  };

  const openWhatsApp = (booking: Booking) => {
    const message = encodeURIComponent(
      `مرحباً ${booking.patient_name}،\n\nتم تأكيد موعدك في عيادة د. إيناس الباشا.\n\n📅 التاريخ: ${booking.preferred_date || "سيتم التحديد"}\n⏰ الوقت: ${booking.preferred_time || "سيتم التحديد"}\n\nنتطلع لرؤيتك!`
    );
    const phone = booking.phone.startsWith("967") ? booking.phone : `967${booking.phone}`;
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-foreground mb-6">الحجوزات</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد حجوزات حتى الآن
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gold">{booking.patient_name}</h3>
                  <div className="flex items-center gap-2 text-gold/60 text-sm">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{booking.phone}</span>
                  </div>
                  {booking.preferred_date && (
                    <div className="flex items-center gap-2 text-gold/60 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.preferred_date}</span>
                    </div>
                  )}
                  {booking.preferred_time && (
                    <div className="flex items-center gap-2 text-gold/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{booking.preferred_time}</span>
                    </div>
                  )}
                  {booking.services?.title && (
                    <div className="text-teal text-sm">{booking.services.title}</div>
                  )}
                  {booking.notes && (
                    <p className="text-gold/50 text-sm">{booking.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status || "pending"]}`}>
                    {statusLabels[booking.status || "pending"]}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openWhatsApp(booking)}
                      className="border-green-500 text-green-500 hover:bg-green-500/10"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    {booking.status !== "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        className="border-teal text-teal hover:bg-teal/10"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {booking.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <span className="text-gold/40 text-xs">
                    {format(new Date(booking.created_at), "PPp", { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
