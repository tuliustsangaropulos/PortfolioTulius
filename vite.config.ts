import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    modulePreload: {
      // The public entry must not preload the route-only administrative router.
      // Keep the dependencies for dynamic JS imports (including /admin) intact.
      resolveDependencies: (_filename, deps, { hostType }) =>
        hostType === "html"
          ? deps.filter((dep) => !/(^|\/)admin-router-[^/]+\.js$/.test(dep))
          : deps,
    },
    rolldownOptions: {
      output: {
        // The broad vendor group avoids a 533 kB main-entry regression.
        // AdminApp remains a separate lazy route chunk.
        codeSplitting: {
          groups: [
            {
              // Split Supabase from React in separate, cacheable chunks.
              // No API/query/auth changes: the original SDK remains intact.
              name: "supabase-sdk",
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            },
            {
              // Shared React libraries stay cacheable. React Router is kept
              // outside this eager group so the lazy /admin route owns it.
              name: "vendor",
              test: (id) =>
                /[\\/]node_modules[\\/]/.test(id) &&
                !/[\\/]node_modules[\\/]react-router[\\/]/.test(id),
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
  },
})
