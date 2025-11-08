/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Désactiver oklch pour éviter les problèmes avec html2canvas
  corePlugins: {
    // Force l'utilisation de RGB au lieu de oklch
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}
