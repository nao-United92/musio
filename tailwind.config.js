import react from '@vitejs/plugin-react';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [react()],
};
