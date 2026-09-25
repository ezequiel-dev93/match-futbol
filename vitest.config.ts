import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/core/**/__tests__/*.test.ts"],
  },
  resolve: {
    alias: {
      "@/core": path.resolve(import.meta.dirname, "./src/core"),
      "@/features": path.resolve(import.meta.dirname, "./src/features"),
      "@/shared": path.resolve(import.meta.dirname, "./src/shared"),
      "@/prisma": path.resolve(import.meta.dirname, "./src/prisma"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});