import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Set base path for GitHub Pages or custom deployment path
  base: '/raaswallet-ui/', // ✅ Change this if repo or subpath is different

  plugins: [react()],

  resolve: {
    alias: {
      // Allows importing with @/ instead of relative paths
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true, // Optional: remove if you don't want source maps
  },
});
