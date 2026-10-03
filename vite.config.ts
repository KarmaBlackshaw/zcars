import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import type { ViteSSGOptions } from "vite-ssg";

import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import content from "./plugins/content";
import head from "./plugins/head";

const BARREL_DIRS = ["src/composables", "src/types", "src/utils"];

async function generateBarrel(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  const entries = await fs.promises.readdir(directoryPath);
  const names = entries.filter((name) => name.endsWith(".ts") && name !== "index.ts" && !name.endsWith(".d.ts")).sort();

  if (names.length === 0) {
    return;
  }

  const content = `/* eslint-disable */\n/** This file is auto generated */\n\n${names.map((name) => `export * from "./${path.basename(name, ".ts")}"`).join("\n")}\n`;
  const indexPath = path.join(directoryPath, "index.ts");
  const current = fs.existsSync(indexPath) ? await fs.promises.readFile(indexPath, "utf-8") : undefined;

  if (current !== content) {
    await fs.promises.writeFile(indexPath, content);
  }
}

const ssgOptions: ViteSSGOptions = {
  onBeforePageRender(_route, indexHTML) {
    if (indexHTML.includes("%VITE_SITE_URL%")) {
      throw new Error(
        '[zcars] VITE_SITE_URL is not set. index.html uses it for og:image, og:url and JSON-LD, and Vite leaves an unset variable as the literal "%VITE_SITE_URL%", so link previews would break. Fix: run "cp .env.example .env.local" for local builds, or set VITE_SITE_URL=https://<your-domain> (no trailing slash) in the host\'s build environment. Not needed for `npm run dev`. See README "Deploy".'
      );
    }

    const isLocalhost = /\/\/(localhost|127\.0\.0\.1)/.test(indexHTML);

    if (isLocalhost) {
      console.warn("[zcars] VITE_SITE_URL points at localhost. Fine for npm run preview; on the host set VITE_SITE_URL=https://<your-domain>.");
    }

    return indexHTML;
  },
};

export default defineConfig({
  plugins: [
    {
      name: "index-generator",
      async buildStart() {
        await Promise.all(BARREL_DIRS.map(generateBarrel));
      },
    },
    content(),
    head(),
    VueRouter({
      routesFolder: "src/pages",
    }),
    Vue(),
    VueDevTools(),
    AutoImport({
      dirs: ["./src/composables", "./src/utils"],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "vue-router", "@vueuse/core"],
      vueTemplate: true,
      dts: true,
      eslintrc: {
        enabled: true,
        filepath: "./auto-import.json",
        globalsPropValue: true,
      },
    }),
    Components({
      dts: true,
      deep: true,
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
    }),
  ],
  server: {
    watch: {
      usePolling: false,
      ignored: ["**/src/{types,composables,utils}/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssgOptions,
});
