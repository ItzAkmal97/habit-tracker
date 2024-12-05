/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#001D3D',
        'gold': '#FFBF00',
        'beige': '#F5E7B4',
      },
    },
  },
  plugins: [],
};
