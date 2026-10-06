import type { Plugin } from "vite";
import { loadEnv } from "vite";

/**
 * DEV ONLY. Serves files in /api (e.g. api/contact.ts -> POST /api/contact)
 * using the same handler code Vercel runs in production, so nothing needs to
 * change when you deploy. `apply: "serve"` means it is never part of the build.
 */
export function localApi(): Plugin {
  return {
    name: "local-api",
    apply: "serve",

    configureServer(server) {
      // Load .env / .env.local (all keys, not just VITE_) into process.env
      const env = loadEnv(server.config.mode, server.config.root, "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        const route = req.url.split("?")[0].replace(/^\/api\//, "").replace(/\/$/, "");
        if (!/^[\w-]+(\/[\w-]+)*$/.test(route)) return next();

        // Minimal Vercel-style helpers: res.status(), res.json(), req.body
        const response = res as any;
        response.status = (code: number) => {
          res.statusCode = code;
          return response;
        };
        response.json = (data: unknown) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return response;
        };

        try {
          // Read and parse the request body
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString("utf8");

          const request = req as any;
          request.body = raw;
          if (raw && req.headers["content-type"]?.includes("application/json")) {
            try {
              request.body = JSON.parse(raw);
            } catch {
              return response.status(400).json({ success: false, message: "Invalid JSON." });
            }
          }

          let mod: any;
          try {
            mod = await server.ssrLoadModule(`/api/${route}.ts`);
          } catch (err: any) {
            if (err?.code === "ERR_LOAD_URL" || /Failed to load url/i.test(String(err?.message))) {
              return response.status(404).json({ success: false, message: "Not found." });
            }
            throw err;
          }

          await mod.default(request, response);
        } catch (err) {
          console.error("[local-api] Error:", err);
          if (!res.headersSent) {
            response.status(500).json({ success: false, message: "Internal error." });
          }
        }
      });
    },
  };
}