import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Data": path.resolve(__dirname, "./src/data"),
      "@Styled": path.resolve(__dirname, "./src/styled-components"),
      "@Store": path.resolve(__dirname, "./src/store"),
      "@Hooks": path.resolve(__dirname, "./src/hooks"),
      "@Screens": path.resolve(__dirname, "./src/screens"),
      "@Src": path.resolve(__dirname, "./src"),
    },
  },
});
