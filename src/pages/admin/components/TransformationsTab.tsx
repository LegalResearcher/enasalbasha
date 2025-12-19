import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Transformation = {
  id: string;
  title: string;
  description: string | null;
  before_image: string;
  after_image: string;
  is_visible: boolean | null;
  display_order: number | null;
};

export default function TransformationsTab() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transformation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    before_image: "",
    after_image: "",
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transformations")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    } else {
      setTransformations(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialog = (item?: Transformation) => {
    if (item) {
      setEditingItem(item);
      setForm({
        title: item.title,
        description: item.description || "",
        before_image: item.before_image,
        after_image: item.after_image,
      });
    } else {
      setEditingItem(null);
      setForm({
        title: "",
        description: "",
        before_image: "",
        after_image: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.before_image.trim() || !form.after_image.trim()) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    if (transformations.length >= 15 && !editingItem) {
      toast({ title: "الحد الأقصى 15 تحول", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    if (editingItem) {
      const { error } = await supabase
        .from("transformations")
        .update({
          title: form.title,
          description: form.description,
          before_image: form.before_image,
          after_image: form.after_image,
        })
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "خطأ في التحديث", variant: "destructive" });
      } else {
        toast({ title: "تم التحديث بنجاح" });
        setIsDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("transformations").insert({
        title: form.title,
        description: form.description,
        before_image: form.before_image,
        after_image: form.after_image,
        display_order: transformations.length,
      });

      if (error) {
        toast({ title: "خطأ في الإضافة", variant: "destructive" });
      } else {
        toast({ title: "تمت الإضافة بنجاح" });
        setIsDialogOpen(false);
        fetchData();
      }
    }
    setIsSaving(false);
  };

  const toggleVisibility = async (item: Transformation) => {
    const { error } = await supabase
      .from("transformations")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (!error) fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("transformations").delete().eq("id", id);

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
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground">التحولات (قبل وبعد)</h2>
          <p className="text-gold/50 text-sm">{transformations.length}/15</p>
        </div>
        <Button 
          onClick={() => openDialog()} 
          variant="hero"
          disabled={transformations.length >= 15}
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة تحول
        </Button>
      </div>

      {transformations.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد تحولات. أضف واحدة للبدء.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {transformations.map((item) => (
            <div
              key={item.id}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-4"
            >
              <div className="flex gap-2 mb-3">
                <img 
                  src={item.before_image} 
                  alt="قبل" 
                  className="w-1/2 h-24 object-cover rounded-lg"
                />
                <img 
                  src={item.after_image} 
                  alt="بعد" 
                  className="w-1/2 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gold">{item.title}</h3>
                  <p className="text-gold/50 text-sm line-clamp-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleVisibility(item)}
                    className="text-gold/60 hover:text-gold"
                  >
                    {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDialog(item)}
                    className="text-gold/60 hover:text-gold"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-navy border-gold/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold">
              {editingItem ? "تعديل التحول" : "إضافة تحول جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gold/80 mb-2 text-sm">العنوان *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الوصف</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gold/80 mb-2 text-sm">صورة قبل *</label>
                <ImageUpload
                  value={form.before_image}
                  onChange={(url) => setForm({ ...form, before_image: url })}
                  folder="transformations"
                />
              </div>
              <div>
                <label className="block text-gold/80 mb-2 text-sm">صورة بعد *</label>
                <ImageUpload
                  value={form.after_image}
                  onChange={(url) => setForm({ ...form, after_image: url })}
                  folder="transformations"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} variant="hero" disabled={isSaving} className="flex-1">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                {editingItem ? "تحديث" : "إضافة"}
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
