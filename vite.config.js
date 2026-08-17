import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/My-bakery-webapp-main/', // Must match your GitHub repository name exactly with slashes
});