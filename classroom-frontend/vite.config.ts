import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    force: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-refine": ["@refinedev/core", "@refinedev/rest", "@refinedev/react-router"],
          "vendor-ui": ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "lucide-react"],
          "vendor-charts": ["recharts"],
        },
      },
    },
  },
  ssr: {
    noExternal: ["lightningcss"],
  },
});
