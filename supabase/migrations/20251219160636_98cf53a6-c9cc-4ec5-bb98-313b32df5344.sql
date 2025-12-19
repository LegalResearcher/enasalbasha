-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon TEXT DEFAULT 'Sparkles',
  main_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transformations table (before/after cases)
CREATE TABLE public.transformations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  before_image TEXT NOT NULL,
  after_image TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery table for clinic photos
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create homepage_sections table for page builder
CREATE TABLE public.homepage_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table for social links etc
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies for frontend
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Transformations are viewable by everyone" ON public.transformations FOR SELECT USING (true);
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Gallery is viewable by everyone" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Homepage sections are viewable by everyone" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- Public insert for bookings (anyone can book)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users can manage)
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage transformations" ON public.transformations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage homepage sections" ON public.homepage_sections FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage faqs" ON public.faqs FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Insert default homepage sections
INSERT INTO public.homepage_sections (section_key, title, display_order) VALUES
('hero', 'البطل الرئيسي', 1),
('services', 'خدماتنا', 2),
('transformations', 'قبل وبعد', 3),
('testimonials', 'آراء المرضى', 4),
('gallery', 'جولة في العيادة', 5),
('faq', 'الأسئلة الشائعة', 6),
('booking', 'احجز موعدك', 7),
('contact', 'تواصل معنا', 8);

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, display_order) VALUES
('يا دكتورة، الكل يخوفني من سحب العصب ويقولوا يوجع، هل هذا الكلام صدق؟', 'زمان كان هذا الكلام صحيح، بس اليوم نستخدم أجهزة حديثة وتقنيات متطورة تخلي الجلسة سريعة ومريحة جداً. ما بنقولك "سحر"، بس بنوعدك بتجربة مريحة وبأقل ألم ممكن.', 1),
('أيش الفرق بين التركيبات (التلبيسات) العادية والزيركون؟ وأيش المناسب لي؟', 'إحنا في العيادة نوفر النوعين (خزف وزيركون). الزيركون طبعاً هو الأحدث والأقوى ويعطي شكل جمالي طبيعي جداً للأسنان الأمامية، بينما الخزف خيار اقتصادي ممتاز. بعد الكشف بحدد لك الأنسب لحالتك وميزانيتك.', 2),
('عندي تصبغات في اللثة (لثة غامقة)، هل لها حل؟', 'طبعاً، عندنا خدمة "توريد اللثة" ومعالجة التصبغات. بنعالج اللثة ونرجع لونها الطبيعي الصحي، وهذا بيفرق جداً في شكل ابتسامتك النهائية.', 3),
('أسناني صفراء، هل التبييض يخليها بيضاء من جلسة واحدة؟', 'التبييض يفتح لون الأسنان درجات ملحوظة، لكن عدد الجلسات يعتمد على درجة اصفرار أسنانك وطبيعتها. الأهم عندنا نستخدم مواد آمنة تعطيك نتيجة حلوة بدون مبالغة وبدون ضرر للمينا.', 4),
('عندي ضرس مكسور أو مسوس جداً، هل لازم خلع جراحي؟', 'مش كل الحالات تحتاج جراحة. إحنا بنقيم الحالة، لو خلع عادي بيكون بسيط، ولو احتاج "خلع جراحي" فلا تقلق، يدنا خفيفة والمنطقة بتكون مخدرة تماماً وما بتحس بفرق كبير.', 5),
('زراعة الأسنان، هل هي حل دائم؟', 'الزراعة هي أقرب بديل للسن الطبيعي كشكل ووظيفة. نجاحها واستمرارها معك يعتمد بشكل أساسي (بعد شغل الطبيب المتقن) على اهتمامك بنظافة فمك. لو أهملتها ممكن تتأثر زي السن الطبيعي، ولو حافظت عليها تعيش معك سنين طويلة.', 6);

-- Insert default testimonials
INSERT INTO public.testimonials (name, review, display_order) VALUES
('محمد السياغي', 'بصراحة يدها تتلف بحرير، ما حسيت بأي وجع وأنا أسوي سحب عصب. تسلم يدك يا دكتورة إيناس.', 1),
('أم أمجد العولقي', 'أحلى دكتورة تعاملت معها، ابني كان يخاف موت من الأسنان بس عندها جلس هادئ ومبسوط.', 2),
('سارة اليافعي', 'سويت عندها ابتسامة هوليود، النتيجة فوق الخيال وتغير شكلي 180 درجة. فنانة ومبدعة.', 3),
('عمر باحشوان', 'دكتورة أمينة وتنصحك باللي تحتاجه فعلاً، والعيادة نظيفة ومعقمة تفتح النفس.', 4),
('خديجة البيضاني', 'كنت مترددة أروح، بس ما ندمت. الدكتورة إيناس قمة في الذوق والشغل المتقن.', 5);

-- Insert default services
INSERT INTO public.services (title, description, icon, display_order) VALUES
('تبييض الأسنان', 'احصلي على ابتسامة مشرقة وأسنان بيضاء ناصعة بأحدث تقنيات التبييض الآمنة', 'Sparkles', 1),
('زراعة الأسنان', 'استعيدي أسنانك المفقودة بزراعة احترافية تدوم معك سنوات طويلة', 'Heart', 2),
('تقويم الأسنان', 'نقدم جميع أنواع التقويم لتحصلي على ابتسامة مثالية ومتناسقة', 'Smile', 3),
('ابتسامة هوليود', 'حولي ابتسامتك إلى ابتسامة نجوم هوليود بقشور الفينير والزيركون', 'Star', 4),
('علاج العصب', 'علاج جذور الأسنان بأحدث التقنيات وبدون ألم', 'Shield', 5),
('تركيبات الأسنان', 'تركيبات عالية الجودة من الزيركون والخزف لاستعادة وظيفة وجمال أسنانك', 'Crown', 6);

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
('instagram', 'https://www.instagram.com/dr_enasalbasha?igsh=dDljZ3BweTM2aXg1'),
('facebook', '#'),
('whatsapp', '967'),
('phone', '');

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();