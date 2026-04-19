import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: '/index.html'
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'home.html',
        community: 'community.html',
        story: 'story.html',
        contact: 'contact.html',
        privacy: 'privacy.html',
        terms: 'terms.html',
        admin: 'admin.html'
      }
    }
  }
});
