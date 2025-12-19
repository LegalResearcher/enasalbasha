import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Calendar, 
  Sparkles, 
  Image, 
  Settings, 
  MessageSquare,
  Star,
  HelpCircle,
  LayoutGrid,
  Stethoscope
} from "lucide-react";

type AdminTab = "bookings" | "services" | "transformations" | "gallery" | "testimonials" | "faqs" | "sections" | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  userEmail?: string;
  onLogout: () => void;
}

const menuItems: { id: AdminTab; icon: any; label: string }[] = [
  { id: "bookings", icon: Calendar, label: "الحجوزات" },
  { id: "services", icon: Stethoscope, label: "الخدمات" },
  { id: "transformations", icon: Sparkles, label: "التحولات" },
  { id: "gallery", icon: Image, label: "المعرض" },
  { id: "testimonials", icon: Star, label: "التقييمات" },
  { id: "faqs", icon: HelpCircle, label: "الأسئلة الشائعة" },
  { id: "sections", icon: LayoutGrid, label: "أقسام الصفحة" },
  { id: "settings", icon: Settings, label: "الإعدادات" },
];

export default function AdminSidebar({ activeTab, setActiveTab, userEmail, onLogout }: AdminSidebarProps) {
  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-navy-dark border-l border-gold/10 p-6 z-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
          <span className="text-navy font-bold">د.إ</span>
        </div>
        <div>
          <h2 className="text-gold font-bold">لوحة التحكم</h2>
          <p className="text-gold/50 text-xs truncate max-w-[140px]">{userEmail}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === item.id 
                ? "bg-gold/10 text-gold" 
                : "text-gold/60 hover:text-gold hover:bg-gold/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <Button 
        variant="ghost" 
        onClick={onLogout} 
        className="absolute bottom-6 right-6 left-6 text-gold/60 hover:text-gold"
      >
        <LogOut className="w-5 h-5 ml-2" />
        تسجيل الخروج
      </Button>
    </aside>
  );
}
