import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfig from "./tsconfig.json";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths).map(
        ([key, [relativePath]]) => [
          key.replace("/*", ""),
          path.resolve(__dirname, relativePath.replace("/*", "")),
        ]
      )
    ),
  },
});
