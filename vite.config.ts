import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "favicon.ico", "hero-bg.jpg"],
      manifest: {
        name: "عيادة د. إيناس الباشا",
        short_name: "د. إيناس",
        description: "عيادة د. إيناس الباشا لطب وجراحة الفم والأسنان في صنعاء - تجميل وزراعة الأسنان",
        theme_color: "#C9A84C",
        background_color: "#0a1628",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "ar",
        dir: "rtl",
        categories: ["health", "medical"],
        shortcuts: [
          {
            name: "احجز موعداً",
            short_name: "حجز",
            description: "احجز موعدك في العيادة",
            url: "/#booking",
            icons: [{ src: "/logo.png", sizes: "96x96" }]
          },
          {
            name: "خدماتنا",
            short_name: "الخدمات",
            description: "تعرف على خدمات العيادة",
            url: "/#services",
            icons: [{ src: "/logo.png", sizes: "96x96" }]
          }
        ],
        icons: [
          { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/admin/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/snhhinqtrsfnhyzhlypf\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
