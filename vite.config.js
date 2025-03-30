import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000 // หรือ port อื่นๆ ที่ Render รองรับ
  },
  daisyui: {
    themes: ["caramellette"], 
  },
});