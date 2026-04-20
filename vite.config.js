import { defineConfig } from 'vite';
import { copyFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function copyPublicFilesPlugin() {
  return {
    name: 'copy-safe-public-files',
    closeBundle() {
      const srcDir = 'public';
      const destDir = 'dist';
      try {
        const files = readdirSync(srcDir);
        files.forEach(file => {
          if (!file.includes(' ')) {
            try {
              copyFileSync(join(srcDir, file), join(destDir, file));
            } catch(e) {}
          }
        });
      } catch(e) {}
    }
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [copyPublicFilesPlugin()],
  server: {
    port: 5173,
    host: true,
    open: '/index.html'
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html'
      }
    }
  }
});
