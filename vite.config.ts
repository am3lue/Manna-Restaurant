import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

const apiMiddleware = () => {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/')) {
          try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            let apiFile = url.pathname.replace('/api/', '');
            if (apiFile.endsWith('/')) apiFile = apiFile.slice(0, -1);

            const apiPath = `./api/${apiFile}.ts`;

            // Check if file exists to prevent crashing Vite on wrong URLs
            if (!fs.existsSync(path.resolve(__dirname, apiPath))) {
               res.statusCode = 404;
               res.end(JSON.stringify({ error: "API route not found" }));
               return;
            }

            const module = await server.ssrLoadModule(apiPath);

            // Parse body for POST/PATCH
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              if (body) {
                try {
                  req.body = JSON.parse(body);
                } catch(e) {
                  req.body = body;
                }
              } else {
                req.body = {};
              }

              // Polyfill Vercel/Express response methods
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };

              req.query = Object.fromEntries(url.searchParams);

              try {
                await module.default(req, res);
              } catch (err) {
                console.error("API execution error:", err);
                res.status(500).json({ error: err.message });
              }
            });
            return;
          } catch (e) {
            console.error("API routing error:", e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Internal API Server Error" }));
            return;
          }
        }
        next();
      });
    }
  }
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
