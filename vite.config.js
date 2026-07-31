import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Lore markdown lives beside the app source (bestiary/, canon/, world/, ...)
  // and is pulled in at build time via import.meta.glob in src/lore.js.
  assetsInclude: ["**/*.md"],
});
