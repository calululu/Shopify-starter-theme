import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

const entries = {};

fs.readdirSync("./src/js").forEach((file) => {
  if (file.endsWith(".js")) {
    const name = file.replace(".js", "");

    entries[name] = resolve(__dirname, `src/js/${file}`);
  }
});

export default defineConfig({
  build: {
    outDir: "assets",

    emptyOutDir: false,

    manifest: false,

    rollupOptions: {
      input: entries,

      output: {
        entryFileNames: "[name].js",

        chunkFileNames: "chunks/[name].js",

        assetFileNames: "[name][extname]",
      },
    },
  },
});
