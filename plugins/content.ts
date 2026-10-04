import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { z } from "zod";
import { slugSchema } from "../src/types/content";
import type { TContent, TEntry } from "../src/types/content";
import { faqsSchema } from "../src/types/faq";
import { homeSchema } from "../src/types/home";
import { partnerSchema } from "../src/types/partner";
import { projectSchema } from "../src/types/project";
import { promosSchema } from "../src/types/promo";
import { reviewSchema } from "../src/types/review";
import { seoSchema } from "../src/types/seo";
import { serviceSchema } from "../src/types/service";
import { siteSchema } from "../src/types/site";
import { getTodayInManila } from "../src/utils/date";

const CONTENT_DIR = "src/content";
const VIRTUAL_ID = "virtual:content";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const byOrder = <T extends { order: number; slug: string }>(a: T, b: T) => a.order - b.order || a.slug.localeCompare(b.slug);

export function loadContent(root: string): TContent {
  const contentDir = path.join(root, CONTENT_DIR);
  const uploadsDir = path.join(root, "public/uploads");
  const uploads = new Set(fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : []);
  const problems: string[] = [];

  const listJson = (folder: string) => {
    const dir = path.join(contentDir, folder);

    return fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((name) => name.endsWith(".json"))
          .sort()
      : [];
  };

  const parseFile = <T>(schema: z.ZodType<T>, file: string): T | undefined => {
    const label = `${CONTENT_DIR}/${file}`;
    let json: unknown;

    try {
      json = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
    } catch (error) {
      problems.push(`${label}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);

      return undefined;
    }

    const result = schema.safeParse(json);

    if (!result.success) {
      problems.push(`${label}\n${z.prettifyError(result.error)}`);

      return undefined;
    }

    return result.data;
  };

  const parseCollection = <T>(folder: string, schema: z.ZodType<T>): TEntry<T>[] =>
    listJson(folder).flatMap((name) => {
      const slug = path.basename(name, ".json");
      const isValidSlug = slugSchema.safeParse(slug).success;

      if (!isValidSlug) {
        problems.push(
          `${CONTENT_DIR}/${folder}/${name}: the file name "${slug}" must start with a lowercase letter or number and use only lowercase letters, numbers and dashes`
        );
      }

      const data = parseFile(schema, `${folder}/${name}`);

      return data != null && isValidSlug ? [{ ...data, slug }] : [];
    });

  const checkImage = (file: string, field: string, value: string | undefined) => {
    if (value != null && !uploads.has(path.posix.basename(value))) {
      problems.push(`${CONTENT_DIR}/${file}: ${field} points to ${value}, which is not in public/uploads (file names are case sensitive)`);
    }
  };

  const site = parseFile(siteSchema, "site.json");
  const home = parseFile(homeSchema, "home.json");
  const promosFile = parseFile(promosSchema, "promos.json");
  const seo = parseFile(seoSchema, "seo.json");
  const services = parseCollection("services", serviceSchema).sort(byOrder);

  const projects = parseCollection("projects", projectSchema).sort(
    (a, b) => (b.completed_on ?? "").localeCompare(a.completed_on ?? "") || a.title.localeCompare(b.title)
  );
  const reviews = parseCollection("reviews", reviewSchema).sort((a, b) => b.date.localeCompare(a.date));
  const faqs = parseFile(faqsSchema, "faqs.json");
  const partners = parseCollection("partners", partnerSchema).sort((a, b) => a.name.localeCompare(b.name));

  checkImage("home.json", "hero.image", home?.hero.image);
  checkImage("home.json", "repaint.image", home?.repaint.image);
  checkImage("home.json", "team.image", home?.team.image);
  checkImage("seo.json", "og_image", seo?.og_image);
  services.forEach((service) => checkImage(`services/${service.slug}.json`, "photo.image", service.photo));
  partners.forEach((partner) => checkImage(`partners/${partner.slug}.json`, "logo", partner.logo));

  const serviceSlugs = new Set(listJson("services").map((name) => path.basename(name, ".json")));

  promosFile?.promos.forEach((promo, index) => {
    checkImage("promos.json", `promos[${index}].photo`, promo.photo);

    if (promo.service != null && !serviceSlugs.has(promo.service)) {
      problems.push(`${CONTENT_DIR}/promos.json: promos[${index}].service "${promo.service}" is not a service. Was it renamed or deleted?`);
    }
  });

  projects.forEach((project) => {
    const file = `projects/${project.slug}.json`;

    project.photos.forEach((photo, index) => checkImage(file, `photos[${index}]`, photo));

    project.services.forEach((slug, index) => {
      if (!serviceSlugs.has(slug)) {
        problems.push(`${CONTENT_DIR}/${file}: services[${index}] "${slug}" is not a service. Was it renamed or deleted?`);
      }
    });
  });

  if (site == null || home == null || promosFile == null || seo == null || faqs == null || problems.length > 0) {
    throw new Error(`[zcars] Content is invalid. Fix these in the CMS (or src/content) and publish again:\n\n${problems.join("\n\n")}`);
  }

  const builtOn = getTodayInManila();
  const promos = promosFile.promos.filter((promo) => promo.ends_on == null || promo.ends_on >= builtOn);

  return {
    site,
    home,
    promos,
    builtOn,
    seo,
    services,
    projects,
    reviews,
    faqs: faqs.questions,
    partners,
  };
}

export default function content(): Plugin {
  let root = process.cwd();

  return {
    name: "zcars-content",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return undefined;
      }

      const data = loadContent(root);

      return Object.entries(data)
        .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
        .join("\n");
    },
    configureServer(server) {
      const contentDir = path.join(root, CONTENT_DIR);

      const reload = (file: string) => {
        if (!file.startsWith(`${contentDir}${path.sep}`)) {
          return;
        }

        const module = server.moduleGraph.getModuleById(RESOLVED_ID);

        if (module != null) {
          server.moduleGraph.invalidateModule(module);
        }

        server.ws.send({ type: "full-reload" });
      };

      server.watcher.add(contentDir);
      server.watcher.on("add", reload).on("change", reload).on("unlink", reload);
    },
  };
}
