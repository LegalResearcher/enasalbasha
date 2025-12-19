import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Instagram, Facebook, Phone, MapPin, Clock } from "lucide-react";

type Setting = {
  id: string;
  key: string;
  value: string | null;
};

const settingsConfig = [
  { key: "clinic_name", label: "اسم العيادة", icon: null },
  { key: "phone", label: "رقم الهاتف", icon: Phone },
  { key: "whatsapp", label: "رقم الواتساب", icon: Phone },
  { key: "address", label: "العنوان", icon: MapPin },
  { key: "working_hours", label: "ساعات العمل", icon: Clock },
  { key: "instagram", label: "رابط انستغرام", icon: Instagram },
  { key: "facebook", label: "رابط فيسبوك", icon: Facebook },
];

export default function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data, error } = await supabase.from("site_settings").select("*");

    if (error) {
      toast({ title: "خطأ في تحميل الإعدادات", variant: "destructive" });
    } else {
      const settingsMap: Record<string, string> = {};
      data?.forEach((s) => {
        settingsMap[s.key] = s.value || "";
      });
      setSettings(settingsMap);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    for (const config of settingsConfig) {
      const value = settings[config.key] || "";
      
      // Check if setting exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", config.key)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("site_settings")
          .update({ value })
          .eq("key", config.key);
      } else {
        await supabase.from("site_settings").insert({ key: config.key, value });
      }
    }

    toast({ title: "تم حفظ الإعدادات بنجاح" });
    setIsSaving(false);
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
        <h2 className="text-2xl font-bold text-primary-foreground">إعدادات الموقع</h2>
        <Button onClick={handleSave} variant="hero" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
          حفظ الإعدادات
        </Button>
      </div>

      <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-6 space-y-6">
        {settingsConfig.map((config) => (
          <div key={config.key}>
            <label className="flex items-center gap-2 text-gold mb-2 text-sm">
              {config.icon && <config.icon className="w-4 h-4" />}
              {config.label}
            </label>
            <Input
              value={settings[config.key] || ""}
              onChange={(e) =>
                setSettings({ ...settings, [config.key]: e.target.value })
              }
              className="bg-navy-dark border-gold/20 text-gold"
              dir={config.key.includes("instagram") || config.key.includes("facebook") ? "ltr" : "rtl"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
