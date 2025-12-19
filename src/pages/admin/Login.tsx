import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "تم تسجيل الدخول بنجاح" });
      navigate("/admin/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4">
            <span className="text-navy font-bold text-2xl">د.إ</span>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">لوحة التحكم</h1>
          <p className="text-gold/60">عيادة د. إيناس الباشا</p>
        </div>

        <form onSubmit={handleLogin} className="bg-navy-light/50 rounded-2xl p-8 border border-gold/10 space-y-6">
          <div>
            <label className="block text-gold mb-2 text-sm">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-navy border-gold/20 text-gold pr-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gold mb-2 text-sm">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-navy border-gold/20 text-gold pr-11"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
