import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Eye, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

// WhatsApp Icon component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MessagesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "تم تحديث الحالة" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "تم حذف الرسالة" });
      setIsDialogOpen(false);
      setSelectedMessage(null);
    },
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    if (message.status === "new") {
      updateStatusMutation.mutate({ id: message.id, status: "read" });
    }
  };

  const handleWhatsAppReply = (phone: string, name: string) => {
    const message = encodeURIComponent(`مرحباً ${name}، شكراً لتواصلك معنا.`);
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-primary text-primary-foreground">جديد</Badge>;
      case "read":
        return <Badge variant="secondary">مقروء</Badge>;
      case "replied":
        return <Badge className="bg-green-600 text-white">تم الرد</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          الرسائل ({messages.length})
        </h2>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد رسائل حتى الآن
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                msg.status === "new" ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() => handleViewMessage(msg)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(msg.status)}
                      <span className="font-semibold text-foreground">{msg.name}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(msg.created_at), "d MMMM yyyy، h:mm a", { locale: ar })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewMessage(msg);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">تفاصيل الرسالة</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-semibold text-foreground" dir="ltr">
                    {selectedMessage.phone}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-semibold text-foreground">
                  {selectedMessage.email || "-"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">الموضوع</p>
                <p className="font-semibold text-foreground">{selectedMessage.subject}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">التاريخ</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(selectedMessage.created_at), "d MMMM yyyy، h:mm a", {
                    locale: ar,
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">الرسالة</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleWhatsAppReply(selectedMessage.phone, selectedMessage.name);
                    updateStatusMutation.mutate({ id: selectedMessage.id, status: "replied" });
                  }}
                >
                  <WhatsAppIcon />
                  <span className="mr-2">الرد عبر واتساب</span>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesTab;
