import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Loader2, Save, X, GripVertical, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Service = {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  icon: string | null;
  main_image: string | null;
  video_url: string | null;
  gallery: any;
  is_visible: boolean | null;
  display_order: number | null;
};

const iconOptions = ["Sparkles", "Smile", "Heart", "Star", "Shield", "Zap", "Sun", "Moon"];

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    long_description: "",
    icon: "Sparkles",
    main_image: "",
    video_url: "",
  });

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "خطأ في تحميل الخدمات", variant: "destructive" });
    } else {
      setServices(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({
        title: service.title,
        description: service.description || "",
        long_description: service.long_description || "",
        icon: service.icon || "Sparkles",
        main_image: service.main_image || "",
        video_url: service.video_url || "",
      });
    } else {
      setEditingService(null);
      setForm({
        title: "",
        description: "",
        long_description: "",
        icon: "Sparkles",
        main_image: "",
        video_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "يرجى إدخال اسم الخدمة", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update({
          title: form.title,
          description: form.description,
          long_description: form.long_description,
          icon: form.icon,
          main_image: form.main_image,
          video_url: form.video_url,
        })
        .eq("id", editingService.id);

      if (error) {
        toast({ title: "خطأ في تحديث الخدمة", variant: "destructive" });
      } else {
        toast({ title: "تم تحديث الخدمة بنجاح" });
        setIsDialogOpen(false);
        fetchServices();
      }
    } else {
      const { error } = await supabase.from("services").insert({
        title: form.title,
        description: form.description,
        long_description: form.long_description,
        icon: form.icon,
        main_image: form.main_image,
        video_url: form.video_url,
        display_order: services.length,
      });

      if (error) {
        toast({ title: "خطأ في إضافة الخدمة", variant: "destructive" });
      } else {
        toast({ title: "تمت إضافة الخدمة بنجاح" });
        setIsDialogOpen(false);
        fetchServices();
      }
    }
    setIsSaving(false);
  };

  const toggleVisibility = async (service: Service) => {
    const { error } = await supabase
      .from("services")
      .update({ is_visible: !service.is_visible })
      .eq("id", service.id);

    if (error) {
      toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    } else {
      fetchServices();
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ في حذف الخدمة", variant: "destructive" });
    } else {
      toast({ title: "تم حذف الخدمة" });
      fetchServices();
    }
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-foreground">الخدمات</h2>
        <Button onClick={() => openDialog()} variant="hero">
          <Plus className="w-4 h-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد خدمات. أضف خدمة جديدة للبدء.
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-4 flex items-center gap-4"
            >
              <GripVertical className="w-5 h-5 text-gold/30 cursor-grab" />
              {service.main_image && (
                <img src={service.main_image} alt={service.title} className="w-12 h-12 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gold">{service.title}</h3>
                <p className="text-gold/50 text-sm line-clamp-1">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleVisibility(service)}
                  className="text-gold/60 hover:text-gold"
                >
                  {service.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openDialog(service)}
                  className="text-gold/60 hover:text-gold"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteService(service.id)}
                  className="text-red-400/60 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-navy border-gold/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold">
              {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gold/80 mb-2 text-sm">اسم الخدمة *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                placeholder="مثال: تبييض الأسنان"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الأيقونة</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setForm({ ...form, icon })}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      form.icon === icon
                        ? "bg-gold text-navy"
                        : "bg-navy-dark text-gold/60 hover:text-gold"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الوصف القصير</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الوصف التفصيلي</label>
              <Textarea
                value={form.long_description}
                onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الصورة الرئيسية</label>
              <ImageUpload
                value={form.main_image}
                onChange={(url) => setForm({ ...form, main_image: url })}
                folder="services"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">رابط الفيديو (يوتيوب أو مباشر)</label>
              <Input
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} variant="hero" disabled={isSaving} className="flex-1">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                {editingService ? "تحديث" : "إضافة"}
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="border-gold/20 text-gold"
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
