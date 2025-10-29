import { defineConfig } from "tsup";

const entry = ["index.ts"];

export default defineConfig([
  {
    clean: true,
    entry,
    format: ["cjs"],
    outDir: "dist",
    dts: true,
  },
]);
