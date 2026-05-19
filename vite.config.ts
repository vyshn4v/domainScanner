import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    host: "app.vyshnavpc.local",
    port: 5173,
    allowedHosts: ["app.vyshnavpc.local"],
  },
});
