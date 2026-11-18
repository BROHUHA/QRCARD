import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import profileImageHandler from './api/profile-image.js';
import coverImageHandler from './api/cover-image.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-endpoints-middleware',
      configureServer(server) {
        server.middlewares.use('/api/profile-image', async (req, res) => {
          const url = new URL(req.url, 'http://localhost:3000');
          const platform = url.searchParams.get('platform') || '';
          const username = url.searchParams.get('username') || '';
          const mockReq = { query: { platform, username }, method: req.method };
          const mockRes = {
            setHeader: (k, v) => res.setHeader(k, v),
            status: (code) => {
              res.statusCode = code;
              return mockRes;
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end: () => res.end(),
          };
          await profileImageHandler(mockReq, mockRes);
        });

        server.middlewares.use('/api/cover-image', async (req, res) => {
          const url = new URL(req.url, 'http://localhost:3000');
          const targetUrl = url.searchParams.get('url') || '';
          const mockReq = { query: { url: targetUrl }, method: req.method };
          const mockRes = {
            setHeader: (k, v) => res.setHeader(k, v),
            status: (code) => {
              res.statusCode = code;
              return mockRes;
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end: () => res.end(),
          };
          await coverImageHandler(mockReq, mockRes);
        });
      },
    },
  ],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
