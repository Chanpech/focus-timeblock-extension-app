import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import webExtension from "vite-plugin-web-extension"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "./manifest.json",
      assets: "public",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
})
