/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")], // ✅ เปิดใช้ daisyUI
    daisyui: {
      themes: ["caramellette"], // ✅ ตั้งค่าให้ใช้ธีม caramellette
    },
  };
  