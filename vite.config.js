import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { workshopApiPlugin } from "./vite-plugin-workshop-api.js";

export default defineConfig({
  plugins: [react(), workshopApiPlugin()],
  // Codex markdown lives beside the app source; artwork is bundled at build time.
  // Numbered bestiary dossiers load at runtime via /api/bestiary.
  assetsInclude: ["**/*.md"],
});
