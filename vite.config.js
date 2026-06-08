import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const paths = {
  src: path.resolve(rootDir, "src"),
  cssEntry: path.resolve(rootDir, "src/css/main.css"),
  jsEntries: path.resolve(rootDir, "src/js/entries"),
  public: path.resolve(rootDir, "src/public"),
  assets: path.resolve(rootDir, "assets"),
  cache: path.resolve(rootDir, "node_modules/.cache/shopify-vite-assets.json"),
};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.resolve(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return fullPath;
  });
}

function toFlatAssetName(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  const withoutExt = relativePath.replace(/\.(js|ts|mjs)$/, "");

  return withoutExt.replace(/[\\/]/g, "-");
}

function getEntries() {
  const entries = {
    main: paths.cssEntry,
  };

  for (const file of walk(paths.jsEntries)) {
    const isScript = /\.(js|ts|mjs)$/.test(file);
    const isDeclaration = /\.d\.ts$/.test(file);

    if (!isScript || isDeclaration) continue;

    const name = toFlatAssetName(file, paths.jsEntries);
    entries[name] = file;
  }

  return entries;
}

function readGeneratedAssetsCache() {
  if (!fs.existsSync(paths.cache)) return [];

  try {
    return JSON.parse(fs.readFileSync(paths.cache, "utf8"));
  } catch {
    return [];
  }
}

function writeGeneratedAssetsCache(files) {
  fs.mkdirSync(path.dirname(paths.cache), { recursive: true });
  fs.writeFileSync(paths.cache, JSON.stringify([...files].sort(), null, 2));
}

function cleanStaleGeneratedAssets(currentFiles) {
  const previousFiles = readGeneratedAssetsCache();

  for (const file of previousFiles) {
    if (currentFiles.has(file)) continue;

    const assetPath = path.resolve(paths.assets, file);

    if (fs.existsSync(assetPath)) {
      fs.rmSync(assetPath, { force: true });
      console.log(`🗑️ Removed stale asset: ${file}`);
    }
  }

  writeGeneratedAssetsCache(currentFiles);
}

function shopifyAssetsSyncPlugin() {
  return {
    name: "shopify-assets-sync",

    writeBundle(_, bundle) {
      const currentFiles = new Set(Object.keys(bundle));

      cleanStaleGeneratedAssets(currentFiles);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), shopifyAssetsSyncPlugin()],

  resolve: {
    alias: {
      "@theme": path.resolve(rootDir, "src/js"),
    },
  },

  publicDir: false,

  build: {
    outDir: "assets",
    emptyOutDir: false,
    manifest: false,
    sourcemap: false,

    rolldownOptions: {
      input: getEntries(),

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunk-[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
