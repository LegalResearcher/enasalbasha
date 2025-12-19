import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Calendar, Users, Image, Settings, MessageCircle } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/admin");
      else setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "تم تسجيل الخروج" });
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-navy-dark border-l border-gold/10 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <span className="text-navy font-bold">د.إ</span>
          </div>
          <div>
            <h2 className="text-gold font-bold">لوحة التحكم</h2>
            <p className="text-gold/50 text-xs">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { icon: Calendar, label: "الحجوزات", active: true },
            { icon: Users, label: "التحولات" },
            { icon: Image, label: "المعرض" },
            { icon: MessageCircle, label: "الخدمات" },
            { icon: Settings, label: "الإعدادات" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active ? "bg-gold/10 text-gold" : "text-gold/60 hover:text-gold hover:bg-gold/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" onClick={handleLogout} className="absolute bottom-6 right-6 left-6 text-gold/60 hover:text-gold">
          <LogOut className="w-5 h-5 ml-2" />
          تسجيل الخروج
        </Button>
      </aside>

      {/* Main Content */}
      <main className="mr-64 p-8">
        <h1 className="text-3xl font-bold text-primary-foreground mb-8">مرحباً بك في لوحة التحكم</h1>
        <p className="text-gold/60">يمكنك إدارة موقعك من هنا. هذا إصدار أولي - ميزات إضافية قادمة قريباً.</p>
      </main>
    </div>
  );
}
