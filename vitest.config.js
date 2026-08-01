import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // API memory store is a module singleton shared across test files.
    fileParallelism: false,
  },
});
