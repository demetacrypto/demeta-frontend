import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // This app is published below the Supervisor Atlas origin, not at `/`.
  base: "/brain-research/",
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes("/three/") ? "three" : undefined;
        }
      }
    }
  }
});
