/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/routes/**/*.{svelte,js,ts}",
    "./src/components/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {

       colors: {
        primary: '#2563EB', // สีฟ้าแบบ Tailwind blue-600
        secondary: '#1E40AF', // สีฟ้าเข้ม blue-800
        bgLight: '#F9FAFB', // สีพื้นหลังอ่อน ๆ
      },

      
    },
  },
  plugins: [],
};
