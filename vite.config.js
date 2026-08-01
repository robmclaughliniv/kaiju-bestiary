import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { workshopApiPlugin } from "./vite-plugin-workshop-api.js";

export default defineConfig({
  plugins: [react(), workshopApiPlugin()],
  // Lore markdown lives beside the app source (bestiary/, canon/, world/, ...)
  // and is pulled in at build time via import.meta.glob in src/lore.js.
  assetsInclude: ["**/*.md"],
});
