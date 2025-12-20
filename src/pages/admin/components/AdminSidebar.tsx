import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LogOut, 
  Calendar, 
  Sparkles, 
  Image, 
  Settings, 
  Star,
  HelpCircle,
  LayoutGrid,
  Stethoscope,
  Menu,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type AdminTab = "bookings" | "services" | "transformations" | "gallery" | "testimonials" | "faqs" | "sections" | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  userEmail?: string;
  onLogout: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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

function SidebarContent({ activeTab, setActiveTab, userEmail, onLogout, onItemClick }: AdminSidebarProps & { onItemClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0">
          <span className="text-navy font-bold">د.إ</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-gold font-bold">لوحة التحكم</h2>
          <p className="text-gold/50 text-xs truncate">{userEmail}</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              onItemClick?.();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === item.id 
                ? "bg-gold/10 text-gold" 
                : "text-gold/60 hover:text-gold hover:bg-gold/5"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <Button 
        variant="ghost" 
        onClick={onLogout} 
        className="mt-auto text-gold/60 hover:text-gold w-full justify-start"
      >
        <LogOut className="w-5 h-5 ml-2" />
        تسجيل الخروج
      </Button>
    </div>
  );
}

export default function AdminSidebar({ activeTab, setActiveTab, userEmail, onLogout, isOpen, onOpenChange }: AdminSidebarProps) {
  const isMobile = useIsMobile();

  // Mobile: Drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 right-0 left-0 h-16 bg-navy-dark border-b border-gold/10 flex items-center justify-between px-4 z-50">
          <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gold">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-navy-dark border-l border-gold/10 p-6">
              <SidebarContent 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userEmail={userEmail} 
                onLogout={onLogout}
                onItemClick={() => onOpenChange?.(false)}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-gold font-bold text-lg">لوحة التحكم</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>
      </>
    );
  }

  // Desktop: Fixed Sidebar
  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-navy-dark border-l border-gold/10 p-6 z-50">
      <SidebarContent 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userEmail={userEmail} 
        onLogout={onLogout}
      />
    </aside>
  );
}
