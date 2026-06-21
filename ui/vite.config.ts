import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
// import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    // analyzer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
