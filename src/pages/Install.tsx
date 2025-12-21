import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor, Download, Check, Share, MoreVertical, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType("ios");
    } else if (/android/.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const benefits = [
    { icon: "⚡", title: "تحميل سريع", description: "التطبيق يعمل بسرعة فائقة" },
    { icon: "📱", title: "أيقونة على الشاشة", description: "وصول سريع من شاشتك الرئيسية" },
    { icon: "🔔", title: "إشعارات فورية", description: "تنبيهات للحجوزات الجديدة" },
    { icon: "🌐", title: "يعمل بدون إنترنت", description: "تصفح المحتوى المخزن مسبقاً" },
  ];

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full bg-navy-light border-gold/20">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-teal/20 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-teal" />
            </div>
            <CardTitle className="text-2xl text-gold">تم التثبيت بنجاح!</CardTitle>
            <CardDescription className="text-gold/60">
              التطبيق مثبت على جهازك ويمكنك الوصول إليه من الشاشة الرئيسية
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button className="bg-gold hover:bg-gold/90 text-navy">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy py-12 px-4" dir="rtl">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="شعار العيادة" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h1 className="text-3xl font-bold text-gold mb-2">تثبيت التطبيق</h1>
          <p className="text-gold/60">احصل على تجربة أفضل بتثبيت التطبيق على جهازك</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-navy-light border-gold/10">
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">{benefit.icon}</span>
                <h3 className="text-gold font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-gold/50 text-xs">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        <Card className="bg-navy-light border-gold/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              {deviceType === "ios" && <Smartphone className="w-6 h-6 text-gold" />}
              {deviceType === "android" && <Smartphone className="w-6 h-6 text-teal" />}
              {deviceType === "desktop" && <Monitor className="w-6 h-6 text-gold" />}
              <CardTitle className="text-xl text-gold">
                {deviceType === "ios" && "التثبيت على iPhone/iPad"}
                {deviceType === "android" && "التثبيت على Android"}
                {deviceType === "desktop" && "التثبيت على الكمبيوتر"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {deviceType === "ios" && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">1</div>
                  <div>
                    <p className="text-gold font-medium">اضغط على زر المشاركة</p>
                    <p className="text-gold/50 text-sm flex items-center gap-1">
                      ابحث عن أيقونة <Share className="w-4 h-4 inline" /> في أسفل الشاشة
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">2</div>
                  <div>
                    <p className="text-gold font-medium">اختر "إضافة إلى الشاشة الرئيسية"</p>
                    <p className="text-gold/50 text-sm flex items-center gap-1">
                      ابحث عن <Plus className="w-4 h-4 inline" /> Add to Home Screen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">3</div>
                  <div>
                    <p className="text-gold font-medium">اضغط "إضافة"</p>
                    <p className="text-gold/50 text-sm">سيظهر التطبيق على شاشتك الرئيسية</p>
                  </div>
                </div>
              </div>
            )}

            {deviceType === "android" && (
              <div className="space-y-4">
                {deferredPrompt ? (
                  <div className="text-center py-4">
                    <p className="text-gold/70 mb-4">جهازك يدعم التثبيت المباشر!</p>
                    <Button 
                      onClick={handleInstallClick}
                      className="bg-teal hover:bg-teal/90 text-navy font-bold px-8 py-6 text-lg"
                    >
                      <Download className="ml-2 h-5 w-5" />
                      تثبيت التطبيق الآن
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold shrink-0">1</div>
                      <div>
                        <p className="text-gold font-medium">اضغط على قائمة Chrome</p>
                        <p className="text-gold/50 text-sm flex items-center gap-1">
                          النقاط الثلاث <MoreVertical className="w-4 h-4 inline" /> في أعلى الشاشة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold shrink-0">2</div>
                      <div>
                        <p className="text-gold font-medium">اختر "تثبيت التطبيق"</p>
                        <p className="text-gold/50 text-sm">أو "إضافة إلى الشاشة الرئيسية"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold shrink-0">3</div>
                      <div>
                        <p className="text-gold font-medium">اضغط "تثبيت"</p>
                        <p className="text-gold/50 text-sm">سيظهر التطبيق على شاشتك الرئيسية</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {deviceType === "desktop" && (
              <div className="space-y-4">
                {deferredPrompt ? (
                  <div className="text-center py-4">
                    <p className="text-gold/70 mb-4">متصفحك يدعم التثبيت المباشر!</p>
                    <Button 
                      onClick={handleInstallClick}
                      className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg"
                    >
                      <Download className="ml-2 h-5 w-5" />
                      تثبيت التطبيق الآن
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">1</div>
                      <div>
                        <p className="text-gold font-medium">ابحث عن أيقونة التثبيت</p>
                        <p className="text-gold/50 text-sm">في شريط العنوان على اليمين</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">2</div>
                      <div>
                        <p className="text-gold font-medium">اضغط على الأيقونة</p>
                        <p className="text-gold/50 text-sm">ستظهر نافذة تأكيد التثبيت</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-navy rounded-lg border border-gold/10">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold shrink-0">3</div>
                      <div>
                        <p className="text-gold font-medium">اضغط "تثبيت"</p>
                        <p className="text-gold/50 text-sm">سيفتح التطبيق في نافذة مستقلة</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-gold/60 hover:text-gold transition-colors">
            <ArrowLeft className="inline ml-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
