import { defineConfig } from 'vite';
import { copyFileSync, readdirSync, readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

function copyPublicFilesPlugin() {
  return {
    name: 'copy-safe-public-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];
        const filePath = join('public', url);
        if (!url.includes(' ') && existsSync(filePath)) {
          try {
            const data = readFileSync(filePath);
            const ext = extname(url).toLowerCase();
            const types = { '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
            if (types[ext]) {
              res.setHeader('Content-Type', types[ext]);
              res.end(data);
              return;
            }
          } catch(e) {}
        }
        next();
      });
    },
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
