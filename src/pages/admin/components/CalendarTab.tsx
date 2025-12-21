import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO, isSameDay } from "date-fns";
import { ar } from "date-fns/locale";
import { Check, X, MessageCircle, Clock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  patient_name: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  service_id: string | null;
  services?: { title: string } | null;
}

export default function CalendarTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, services(title)")
        .order("preferred_date", { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-calendar"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الحجز بنجاح",
      });
    },
  });

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      if (booking.preferred_date) {
        const dateKey = booking.preferred_date;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(booking);
      }
    });
    return grouped;
  }, [bookings]);

  // Get dates that have bookings
  const datesWithBookings = useMemo(() => {
    return Object.keys(bookingsByDate).map((date) => parseISO(date));
  }, [bookingsByDate]);

  // Get bookings for selected date
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return bookingsByDate[dateKey] || [];
  }, [selectedDate, bookingsByDate]);

  // Count bookings by status for selected date
  const statusCounts = useMemo(() => {
    return {
      pending: selectedDateBookings.filter((b) => b.status === "pending").length,
      confirmed: selectedDateBookings.filter((b) => b.status === "confirmed").length,
      cancelled: selectedDateBookings.filter((b) => b.status === "cancelled").length,
    };
  }, [selectedDateBookings]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return "bg-teal text-navy";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gold/20 text-gold";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      default:
        return "قيد الانتظار";
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `مرحباً ${name}، هذه رسالة من عيادة د. إيناس الباشا بخصوص حجزك.`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold text-gold mb-6">تقويم الحجوزات</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 bg-navy-light border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold text-lg">اختر التاريخ</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ar}
              className="rounded-md border border-gold/20 pointer-events-auto"
              modifiers={{
                hasBookings: datesWithBookings,
              }}
              modifiersStyles={{
                hasBookings: {
                  backgroundColor: "hsl(var(--gold) / 0.2)",
                  fontWeight: "bold",
                },
              }}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-gold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gold border border-gold/30 rounded",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gold/60 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative text-gold",
                day: "h-9 w-9 p-0 font-normal text-gold hover:bg-gold/20 rounded-md",
                day_selected: "bg-gold text-navy hover:bg-gold hover:text-navy focus:bg-gold focus:text-navy",
                day_today: "bg-teal/20 text-teal",
                day_outside: "text-gold/30 opacity-50",
                day_disabled: "text-gold/20 opacity-50",
              }}
            />

            {/* Legend */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gold/20" />
                <span className="text-gold/70">يوجد حجوزات</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-teal/20" />
                <span className="text-gold/70">اليوم</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card className="lg:col-span-2 bg-navy-light border-gold/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gold text-lg">
                {selectedDate
                  ? format(selectedDate, "EEEE، d MMMM yyyy", { locale: ar })
                  : "اختر تاريخاً"}
              </CardTitle>
              {selectedDateBookings.length > 0 && (
                <div className="flex gap-2">
                  {statusCounts.pending > 0 && (
                    <Badge variant="outline" className="border-gold/30 text-gold">
                      {statusCounts.pending} قيد الانتظار
                    </Badge>
                  )}
                  {statusCounts.confirmed > 0 && (
                    <Badge className="bg-teal text-navy">
                      {statusCounts.confirmed} مؤكد
                    </Badge>
                  )}
                  {statusCounts.cancelled > 0 && (
                    <Badge variant="destructive">
                      {statusCounts.cancelled} ملغي
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-12 text-gold/50">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد حجوزات في هذا التاريخ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateBookings.map((booking) => (
                  <Card key={booking.id} className="bg-navy border-gold/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="w-4 h-4 text-gold/60" />
                            <span className="font-semibold text-gold">{booking.patient_name}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gold/70">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{booking.phone}</span>
                            </div>
                            {booking.preferred_time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{booking.preferred_time}</span>
                              </div>
                            )}
                          </div>

                          {booking.services?.title && (
                            <p className="text-sm text-teal mt-2">{booking.services.title}</p>
                          )}

                          {booking.notes && (
                            <p className="text-sm text-gold/50 mt-2 bg-navy-light p-2 rounded">
                              {booking.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}
                                className="bg-teal hover:bg-teal/90 text-navy"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(booking.phone, booking.patient_name)}
                            className="border-green-500 text-green-500 hover:bg-green-500/10"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
