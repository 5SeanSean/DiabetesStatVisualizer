import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  // Add the build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure proper module resolution
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Optimize for TypeScript handling
  optimizeDeps: {
    include: ['chart.js']
  },
  // Base path configuration
  base: './'
});