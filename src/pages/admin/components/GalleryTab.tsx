import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Save, X, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type GalleryItem = {
  id: string;
  title: string | null;
  image_url: string;
  is_visible: boolean | null;
  display_order: number | null;
};

export default function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    image_url: "",
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.image_url.trim()) {
      toast({ title: "يرجى إدخال رابط الصورة", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("gallery").insert({
      title: form.title,
      image_url: form.image_url,
      display_order: items.length,
    });

    if (error) {
      toast({ title: "خطأ في الإضافة", variant: "destructive" });
    } else {
      toast({ title: "تمت الإضافة بنجاح" });
      setIsDialogOpen(false);
      setForm({ title: "", image_url: "" });
      fetchData();
    }
    setIsSaving(false);
  };

  const toggleVisibility = async (item: GalleryItem) => {
    const { error } = await supabase
      .from("gallery")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (!error) fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      toast({ title: "خطأ في الحذف", variant: "destructive" });
    } else {
      toast({ title: "تم الحذف" });
      fetchData();
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
        <h2 className="text-2xl font-bold text-primary-foreground">معرض العيادة</h2>
        <Button onClick={() => setIsDialogOpen(true)} variant="hero">
          <Plus className="w-4 h-4 ml-2" />
          إضافة صورة
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد صور في المعرض.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden border border-gold/10"
            >
              <img
                src={item.image_url}
                alt={item.title || "صورة"}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleVisibility(item)}
                  className="text-gold hover:text-gold/80"
                >
                  {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-navy/80 px-2 py-1">
                  <p className="text-gold text-sm truncate">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-navy border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-gold">إضافة صورة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gold/80 mb-2 text-sm">العنوان (اختياري)</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">رابط الصورة *</label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} variant="hero" disabled={isSaving} className="flex-1">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                إضافة
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="border-gold/20 text-gold"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
