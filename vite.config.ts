import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
      entryRoot: "src",
      outDirs: { dir: "dist" },
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    copyPublicDir: false,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
