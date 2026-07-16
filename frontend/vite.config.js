// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/guzolink/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true, // or 'hidden' if you don't want them referenced in the JS but still generated
  },
}));
