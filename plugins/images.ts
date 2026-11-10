import { createHash } from "node:crypto";
import path from "node:path";

import sharp from "sharp";
import type { Plugin } from "vite";

import type { TImage } from "../src/types/image";

const BASE = "/images/content/";
const STEPS = [480, 800, 1200];
const MAX_WIDTH = 1600;
// ponytail: one quality for every photo. 60 at effort 6 keeps the home hero near its old hand-made copy; raise it if photos look soft.
const QUALITY = 60;

const files = new Map<string, Buffer>();

async function resizeImage(url: string): Promise<TImage> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  const { autoOrient } = await sharp(source).metadata();
  const top = Math.min(autoOrient.width, MAX_WIDTH);
  const widths = [...STEPS.filter((width) => width < top), top];

  const name = path
    .parse(new URL(url).pathname)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const hash = createHash("sha1").update(source).digest("hex").slice(0, 8);

  const candidates = await Promise.all(
    widths.map(async (width) => {
      const fileName = `${name}-${hash}-${width}.webp`;
      const output = await sharp(source).autoOrient().resize({ width }).webp({ quality: QUALITY, effort: 6 }).toBuffer();

      files.set(fileName, output);

      return `${BASE}${fileName} ${width}w`;
    })
  );

  return { src: `${BASE}${name}-${hash}-${top}.webp`, srcset: candidates.join(", ") };
}

export async function resizeImages(urls: string[]) {
  const entries = await Promise.all(
    urls.map(async (url): Promise<[string, TImage]> => {
      try {
        return [url, await resizeImage(url)];
      } catch (error) {
        throw new Error(
          `[zcars] Could not resize the photo ${url} (${error instanceof Error ? error.message : String(error)}). Fix or replace it in the Supabase Table Editor.`
        );
      }
    })
  );

  return Object.fromEntries(entries);
}

export default function images(): Plugin {
  let isSsrBuild = false;

  return {
    name: "zcars-images",
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr);
    },
    configureServer(server) {
      server.middlewares.use(BASE, (req, res, next) => {
        const file = files.get(req.url?.slice(1) ?? "");

        if (file == null) {
          next();

          return;
        }

        res.setHeader("Content-Type", "image/webp");
        res.end(file);
      });
    },
    generateBundle() {
      if (isSsrBuild) {
        return;
      }

      files.forEach((source, fileName) => {
        this.emitFile({ type: "asset", fileName: `${BASE.slice(1)}${fileName}`, source });
      });
    },
  };
}
