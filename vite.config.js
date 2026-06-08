// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";
// import { resolve, extname, relative } from "path";
// import fs from "fs";

// const entries = {};
// const srcJsDir = resolve(__dirname, "src/js");
// const srcPublicDir = resolve(__dirname, "src/public");
// const assetsDir = resolve(__dirname, "assets");

// // Maps ts/js files
// function getEntriesRecursive(dir) {
//   if (!fs.existsSync(dir)) return;
//   const files = fs.readdirSync(dir);

//   files.forEach((file) => {
//     const filePath = resolve(dir, file);
//     const stat = fs.statSync(filePath);

//     if (stat.isDirectory()) {
//       getEntriesRecursive(filePath);
//     } else if (file.endsWith(".js") || file.endsWith(".ts")) {
//       const relativePath = relative(srcJsDir, filePath);
//       const pathWithoutExt = relativePath.replace(/\.(js|ts)$/, "");
//       const name = pathWithoutExt.replace(/[\\/]/g, "-");

//       entries[name] = filePath;
//     }
//   });
// }

// getEntriesRecursive(srcJsDir);
// entries["main"] = resolve(__dirname, "src/css/main.css");

// function copyMediaAssets() {
//   if (!fs.existsSync(srcPublicDir)) return;

//   function copyRecursive(src, dest) {
//     if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
//     const files = fs.readdirSync(src);

//     files.forEach((file) => {
//       const srcPath = resolve(src, file);
//       const destPath = resolve(dest, file);

//       if (fs.statSync(srcPath).isDirectory()) {
//         copyRecursive(srcPath, destPath);
//       } else {
//         if (
//           !fs.existsSync(destPath) ||
//           fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime
//         ) {
//           fs.copyFileSync(srcPath, destPath);
//         }
//       }
//     });
//   }

//   copyRecursive(srcPublicDir, assetsDir);
// }

// // Smart assets clean
// function cleanDeletedAssets() {
//   if (!fs.existsSync(assetsDir)) return;
//   const currentEntryNames = Object.keys(entries);
//   const assetFiles = fs.readdirSync(assetsDir);
//   const validMediaFiles = fs.existsSync(srcPublicDir)
//     ? fs.readdirSync(srcPublicDir)
//     : [];

//   assetFiles.forEach((file) => {
//     const ext = extname(file);

//     // Removes deleted JS files
//     if ((ext === ".js") | (ext === ".ts")) {
//       const nameWithoutExt = file.replace(/\.(js|ts)$/, "");
//       if (!currentEntryNames.includes(nameWithoutExt)) {
//         fs.unlinkSync(resolve(assetsDir, file));
//         console.log(`🗑️ Removed JS: ${file}`);
//       }
//     }

//     // Removes deleted Media
//     const mediaExtensions = [
//       ".png",
//       ".jpg",
//       ".jpeg",
//       ".svg",
//       ".webp",
//       ".mp4",
//       ".avif",
//     ];
//     if (mediaExtensions.includes(ext.toLowerCase())) {
//       if (!validMediaFiles.includes(file)) {
//         fs.unlinkSync(resolve(assetsDir, file));
//         console.log(`🗑️ Removed media: ${file}`);
//       }
//     }
//   });
// }

// // Esegui i controlli prima della build
// copyMediaAssets();
// cleanDeletedAssets();

// export default defineConfig({
//   plugins: [tailwindcss()],
//   resolve: {
//     alias: {
//       "@theme": srcJsDir,
//     },
//   },
//   build: {
//     outDir: "assets",
//     emptyOutDir: false,
//     manifest: false,
//     rollupOptions: {
//       input: entries,
//       output: {
//         entryFileNames: "[name].js",
//         chunkFileNames: "[name].js",
//         assetFileNames: "[name][extname]",
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import { resolve, extname, relative, dirname } from "path";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

const entries = {};
const srcJsDir = resolve(__dirname, "src/js");
const srcPublicDir = resolve(__dirname, "src/public");
const assetsDir = resolve(__dirname, "assets");
entries["main"] = resolve(__dirname, "src/css/main.css");

function getEntriesRecursive(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getEntriesRecursive(filePath);
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      const relativePath = relative(srcJsDir, filePath);
      const pathWithoutExt = relativePath.replace(/\.(js|ts)$/, "");
      const name = pathWithoutExt.replace(/[\\/]/g, "-");

      entries[name] = filePath;
    }
  });
}

getEntriesRecursive(srcJsDir);

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@theme": srcJsDir,
    },
  },
  build: {
    outDir: "assets",
    emptyOutDir: false,
    manifest: false,
    rollupOptions: {
      input: entries,
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
