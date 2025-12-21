import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingNotifications } from "@/hooks/useBookingNotifications";
import AdminSidebar from "./components/AdminSidebar";
import BookingsTab from "./components/BookingsTab";
import CalendarTab from "./components/CalendarTab";
import ServicesTab from "./components/ServicesTab";
import TransformationsTab from "./components/TransformationsTab";
import GalleryTab from "./components/GalleryTab";
import TestimonialsTab from "./components/TestimonialsTab";
import FAQsTab from "./components/FAQsTab";
import SectionsTab from "./components/SectionsTab";
import SettingsTab from "./components/SettingsTab";
import { NotificationToggle } from "@/components/admin/NotificationToggle";

type AdminTab = "bookings" | "calendar" | "services" | "transformations" | "gallery" | "testimonials" | "faqs" | "sections" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, isLoading, logout } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Initialize booking notifications listener
  useBookingNotifications();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/admin");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold mb-4">غير مصرح</h1>
          <p className="text-gold/60 mb-6">ليس لديك صلاحية الوصول للوحة التحكم</p>
          <button onClick={logout} className="text-teal hover:underline">
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "bookings": return <BookingsTab />;
      case "calendar": return <CalendarTab />;
      case "services": return <ServicesTab />;
      case "transformations": return <TransformationsTab />;
      case "gallery": return <GalleryTab />;
      case "testimonials": return <TestimonialsTab />;
      case "faqs": return <FAQsTab />;
      case "sections": return <SectionsTab />;
      case "settings": return <SettingsTab />;
      default: return <BookingsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={user?.email}
        onLogout={logout}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <main className={`${isMobile ? 'pt-20 px-4 pb-6' : 'mr-64 p-8'}`}>
        {/* Notification toggle for admin */}
        <div className="flex justify-end mb-4">
          <NotificationToggle />
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
