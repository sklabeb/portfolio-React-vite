import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        user: resolve("user.html"),
        admin: resolve("admin.html"),
        resume: resolve("resume.html")
      }
    }
  }
});
