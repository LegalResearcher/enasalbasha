import { motion } from "framer-motion";
import { Clock, ArrowUpLeft } from "lucide-react";

const articles = [
  {
    id: 1,
    tag: "زراعة الأسنان",
    title: "كيف تعتني بأسنانك بعد الزراعة؟",
    excerpt: "تعليمات دقيقة للحفاظ على نتيجة عملية الزراعة وضمان التئام سريع وآمن.",
    readTime: "3 دقائق",
    num: "01",
  },
  {
    id: 2,
    tag: "تجميل الأسنان",
    title: "الفرق بين الفينير والتلبيس",
    excerpt: "لكل منهما حالاته المناسبة. تعرّف على الفرق الجوهري قبل اتخاذ قرارك.",
    readTime: "4 دقائق",
    num: "02",
  },
  {
    id: 3,
    tag: "تبييض الأسنان",
    title: "5 حقائق عن تبييض الأسنان",
    excerpt: "الحقيقة العلمية الكاملة عن أمان تبييض الأسنان وتأثيره على المينا.",
    readTime: "3 دقائق",
    num: "03",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="py-32 bg-[hsl(var(--cream))] relative overflow-hidden">
      <div className="absolute -top-8 right-8 text-[160px] font-black text-navy/[0.03] leading-none select-none pointer-events-none">06</div>

      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="gold-line" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">معرفة تفيدك</span>
            <div className="gold-line" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-navy">مقالات طبية</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Number */}
              <p className="text-[42px] font-black text-navy/10 leading-none mb-4 group-hover:text-gold/20 transition-colors duration-500">
                {a.num}
              </p>

              {/* Tag + read time */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold tracking-wider text-gold uppercase border border-gold/30 px-3 py-1 rounded-full">
                  {a.tag}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {a.readTime}
                </span>
              </div>

              <h3 className="text-xl font-black text-navy mb-3 group-hover:text-gold transition-colors duration-300 leading-snug">
                {a.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{a.excerpt}</p>

              <div className="flex items-center gap-1.5 text-sm font-bold text-gold/50 group-hover:text-gold transition-colors duration-300">
                اقرأ المقال
                <ArrowUpLeft className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
              </div>

              {/* Bottom border */}
              <div className="mt-8 h-px bg-navy/8 group-hover:bg-gold/30 transition-colors duration-500" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
