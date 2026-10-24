import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Keep framework dependencies cacheable across editorial releases.
        // Vite 8 / Rolldown: do not use deprecated Rollup manualChunks.
        codeSplitting: {
          groups: [
            {
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
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
