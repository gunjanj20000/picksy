import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-progress',
          ],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "placeholder.svg",
        "pwa-icon-192.png",
        "pwa-icon-512.png"
      ],
      manifest: {
        name: "Qapp - Playful Learning & Assessment",
        short_name: "Qapp",
        description: "100% offline interactive child learning and routine assessment app with speech and visual answers",
        theme_color: "#7c3aed",
        background_color: "#fdf4ff",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        categories: ["education", "kids", "learning"]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,webmanifest}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
