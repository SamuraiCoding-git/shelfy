import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Убедись, что путь к твоим файлам корректный
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1D77FF', // Добавим custom color, если он используется часто
      },
    },
  },
  plugins: [
    scrollbarHide, // Плагин для скрытия скроллбаров
  ],
};
