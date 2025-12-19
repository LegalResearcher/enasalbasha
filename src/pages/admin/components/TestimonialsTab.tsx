import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Loader2, Save, X, Eye, EyeOff, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Testimonial = {
  id: string;
  name: string;
  review: string;
  rating: number | null;
  is_visible: boolean | null;
  display_order: number | null;
};

export default function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    review: "",
    rating: 5,
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("testimonials")
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

  const openDialog = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        review: item.review,
        rating: item.rating || 5,
      });
    } else {
      setEditingItem(null);
      setForm({ name: "", review: "", rating: 5 });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) {
      toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    if (editingItem) {
      const { error } = await supabase
        .from("testimonials")
        .update({
          name: form.name,
          review: form.review,
          rating: form.rating,
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
      const { error } = await supabase.from("testimonials").insert({
        name: form.name,
        review: form.review,
        rating: form.rating,
        display_order: items.length,
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

  const toggleVisibility = async (item: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (!error) fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

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
        <h2 className="text-2xl font-bold text-primary-foreground">التقييمات والآراء</h2>
        <Button onClick={() => openDialog()} variant="hero">
          <Plus className="w-4 h-4 ml-2" />
          إضافة تقييم
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد تقييمات.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gold">{item.name}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gold/60 text-sm">{item.review}</p>
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
        <DialogContent className="bg-navy border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-gold">
              {editingItem ? "تعديل التقييم" : "إضافة تقييم جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gold/80 mb-2 text-sm">اسم العميل *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">التقييم</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setForm({ ...form, rating })}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating <= form.rating ? "fill-gold text-gold" : "text-gold/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الرأي *</label>
              <Textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                rows={3}
              />
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
