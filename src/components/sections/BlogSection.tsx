import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Clock, Tag } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "كيف تعتني بأسنانك بعد زراعة الأسنان؟",
    excerpt: "بعد إجراء عملية الزراعة، تحتاج إلى اتباع تعليمات دقيقة للحفاظ على نتيجة العملية وضمان التئام سريع وآمن.",
    tag: "زراعة الأسنان",
    readTime: "3 دقائق",
    emoji: "🦷",
    color: "from-blue-50 to-blue-100/50",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    title: "الفرق بين الفينير والتلبيس (الكراون)",
    excerpt: "يخلط كثيرون بين الفينير والتلبيس، لكن لكل منهما حالاته المناسبة. تعرّف على الفرق قبل اتخاذ قرارك.",
    tag: "تجميل الأسنان",
    readTime: "4 دقائق",
    emoji: "✨",
    color: "from-amber-50 to-amber-100/50",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    title: "5 أسباب تجعل تبييض الأسنان آمناً تماماً",
    excerpt: "كثير من الناس يترددون في تبييض أسنانهم خوفاً على المينا. إليك الحقيقة العلمية الكاملة.",
    tag: "تبييض الأسنان",
    readTime: "3 دقائق",
    emoji: "😁",
    color: "from-purple-50 to-purple-100/50",
    tagColor: "bg-purple-100 text-purple-700",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-white relative overflow-hidden">
      {/* زخرفة خلفية */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-gold font-bold tracking-wider text-sm mb-4 uppercase">
            <BookOpen className="w-4 h-4" />
            معرفة تفيدك
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">
            نصائح ومقالات{" "}
            <span className="text-gold relative inline-block">
              طبية
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/30 rounded-full w-full" />
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            معلومات موثوقة من الدكتورة إيناس لمساعدتك على اتخاذ أفضل قراراتك الصحية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group rounded-2xl bg-gradient-to-br ${article.color} p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer`}
            >
              {/* الإيموجي */}
              <div className="text-5xl mb-5">{article.emoji}</div>

              {/* الوسم والوقت */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.tagColor}`}>
                  <Tag className="w-3 h-3 inline ml-1" />
                  {article.tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                {article.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {article.excerpt}
              </p>

              <div className="flex items-center text-sm font-bold text-navy/50 group-hover:text-gold transition-all duration-300">
                <ArrowLeft className="w-4 h-4 ml-1 group-hover:-translate-x-1 transition-transform" />
                اقرأ المقال
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA أسفل */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-gray-400 text-sm">
            هل لديك سؤال طبي؟{" "}
            <button
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              className="text-gold font-bold hover:underline"
            >
              اطلب استشارة مجانية →
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
