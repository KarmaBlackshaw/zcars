import type { Plugin } from "vite";
import { getServicePath } from "../src/utils/service";
import { loadContent } from "./content";

export default function sitemap(): Plugin {
  let env: Record<string, string> = {};
  let isSsrBuild = false;

  return {
    name: "zcars-sitemap",
    apply: "build",
    configResolved(config) {
      env = config.env;
      isSsrBuild = Boolean(config.build.ssr);
    },
    async generateBundle() {
      const { VITE_SITE_URL } = env;

      if (isSsrBuild || !VITE_SITE_URL) {
        return;
      }

      const { services, builtOn } = await loadContent(env);
      const paths = ["/", ...services.map(({ slug }) => getServicePath(slug))];
      const urls = paths.map((path) => `  <url><loc>${VITE_SITE_URL}${path}</loc><lastmod>${builtOn}</lastmod></url>`);

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
      });

      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${VITE_SITE_URL}/sitemap.xml\n`,
      });
    },
  };
}
