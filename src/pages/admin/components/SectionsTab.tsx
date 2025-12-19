import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Section = {
  id: string;
  section_key: string;
  title: string;
  is_visible: boolean | null;
  display_order: number | null;
};

export default function SectionsTab() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "خطأ في تحميل البيانات", variant: "destructive" });
    } else {
      setSections(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleVisibility = async (section: Section) => {
    const { error } = await supabase
      .from("homepage_sections")
      .update({ is_visible: !section.is_visible })
      .eq("id", section.id);

    if (error) {
      toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    } else {
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-foreground">أقسام الصفحة الرئيسية</h2>
        <p className="text-gold/50 text-sm mt-1">تحكم في إظهار/إخفاء أقسام الصفحة الرئيسية</p>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 text-gold/60">
          لا توجد أقسام مُعرَّفة.
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-navy-light/50 border border-gold/10 rounded-xl p-4 flex items-center gap-4"
            >
              <GripVertical className="w-5 h-5 text-gold/30 cursor-grab" />
              <div className="flex-1">
                <h3 className="font-bold text-gold">{section.title}</h3>
                <p className="text-gold/40 text-xs">{section.section_key}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold/60 text-sm">
                  {section.is_visible ? "ظاهر" : "مخفي"}
                </span>
                <Switch
                  checked={section.is_visible ?? true}
                  onCheckedChange={() => toggleVisibility(section)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
