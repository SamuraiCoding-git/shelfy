// tailwind.config.js
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust this path according to your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarHide,
  ],
};
