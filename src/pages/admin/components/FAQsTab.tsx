import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Loader2, Save, X, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  is_visible: boolean | null;
  display_order: number | null;
};

export default function FAQsTab() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("faqs")
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

  const openDialog = (item?: FAQ) => {
    if (item) {
      setEditingItem(item);
      setForm({
        question: item.question,
        answer: item.answer,
      });
    } else {
      setEditingItem(null);
      setForm({ question: "", answer: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    if (editingItem) {
      const { error } = await supabase
        .from("faqs")
        .update({
          question: form.question,
          answer: form.answer,
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
      const { error } = await supabase.from("faqs").insert({
        question: form.question,
        answer: form.answer,
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

  const toggleVisibility = async (item: FAQ) => {
    const { error } = await supabase
      .from("faqs")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (!error) fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("faqs").delete().eq("id", id);

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
        <h2 className="text-2xl font-bold text-primary-foreground">الأسئلة الشائعة</h2>
        <Button onClick={() => openDialog()} variant="hero">
          <Plus className="w-4 h-4 ml-2" />
          إضافة سؤال
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد أسئلة شائعة.
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
                  <h3 className="font-bold text-gold mb-2">{item.question}</h3>
                  <p className="text-gold/60 text-sm">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 mr-4">
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
              {editingItem ? "تعديل السؤال" : "إضافة سؤال جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gold/80 mb-2 text-sm">السؤال *</label>
              <Input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 mb-2 text-sm">الإجابة *</label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="bg-navy-dark border-gold/20 text-gold"
                rows={4}
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
