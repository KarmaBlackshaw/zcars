import { createClient, type PostgrestError } from "@supabase/supabase-js";
import type { Plugin } from "vite";
import { z } from "zod";

import { httpsUrlSchema, textSchema, type TContent } from "../src/types/content";
import { faqSchema } from "../src/types/faq";
import { hiringRoleSchema } from "../src/types/hiring";
import { homeSchema } from "../src/types/home";
import { partnerSchema } from "../src/types/partner";
import { projectSchema } from "../src/types/project";
import { promoSchema } from "../src/types/promo";
import { reviewSchema } from "../src/types/review";
import { seoSchema } from "../src/types/seo";
import { serviceSchema } from "../src/types/service";
import { siteSchema } from "../src/types/site";
import { statSchema } from "../src/types/stat";
import { getTodayInManila } from "../src/utils/date";
import { resizeImages } from "./images";

const VIRTUAL_ID = "virtual:content";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const envSchema = z.object({ VITE_SUPABASE_URL: httpsUrlSchema, VITE_SUPABASE_PUBLISHABLE_KEY: textSchema });

type TResult = { data: unknown; error: PostgrestError | null };

const describeRow = (row: unknown) => {
  if (typeof row === "object" && row != null) {
    if ("slug" in row) {
      return String(row.slug);
    }

    if ("id" in row) {
      return `id ${String(row.id)}`;
    }
  }

  return "unknown";
};

// ponytail: fetched once per process; restart `npm run dev` to see Supabase edits locally.
let cached: Promise<TContent> | undefined;

export function loadContent(env: unknown) {
  cached ??= fetchContent(env);

  return cached;
}

async function fetchContent(env: unknown): Promise<TContent> {
  const parsedEnv = envSchema.safeParse(env);

  if (!parsedEnv.success) {
    throw new Error(
      "[zcars] VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are not set. Locally: add them to .env.local (values are in Netlify: Project configuration, Environment variables). On Netlify: set them there."
    );
  }

  const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = parsedEnv.data;
  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  const builtOn = getTodayInManila();
  const problems: string[] = [];

  const [
    siteResult,
    hoursResult,
    homeResult,
    seoResult,
    servicesResult,
    projectsResult,
    reviewsResult,
    promosResult,
    faqsResult,
    partnersResult,
    statsResult,
    hiringResult,
  ] = await Promise.all([
    supabase.from("site").select().single(),
    supabase.from("opening_hours").select().order("day").order("opens"),
    supabase.from("home").select().single(),
    supabase.from("seo").select().single(),
    supabase.from("services").select().order("position").order("slug"),
    supabase.from("projects").select().order("completed_on", { ascending: false, nullsFirst: false }).order("title"),
    supabase.from("reviews").select().order("reviewed_on", { ascending: false }),
    supabase.from("promos").select().or(`ends_on.is.null,ends_on.gte.${builtOn}`).order("position"),
    supabase.from("faqs").select().order("position"),
    supabase.from("partners").select().order("name"),
    supabase.from("stats").select().order("position"),
    supabase.from("hiring_roles").select().order("position"),
  ]);

  function parseRow<T extends z.ZodType>(table: string, schema: T, { data, error }: TResult) {
    if (error != null) {
      problems.push(`${table}: ${error.message}`);

      return undefined;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      problems.push(`${table}\n${z.prettifyError(result.error)}`);

      return undefined;
    }

    return result.data;
  }

  function parseRows<T extends z.ZodType>(table: string, schema: T, { data, error }: TResult) {
    if (error != null) {
      problems.push(`${table}: ${error.message}`);

      return [];
    }

    const rows: unknown[] = Array.isArray(data) ? data : [];

    return rows.flatMap((row) => {
      const result = schema.safeParse(row);

      if (result.success) {
        return [result.data];
      }

      problems.push(`${table}, row ${describeRow(row)}\n${z.prettifyError(result.error)}`);

      return [];
    });
  }

  const site = parseRow("site", siteSchema, {
    data: { ...siteResult.data, hours: hoursResult.data },
    error: siteResult.error ?? hoursResult.error,
  });
  const home = parseRow("home", homeSchema, homeResult);
  const seo = parseRow("seo", seoSchema, seoResult);
  const services = parseRows("services", serviceSchema, servicesResult);
  const projects = parseRows("projects", projectSchema, projectsResult);
  const serviceSlugs = new Set(services.map(({ slug }) => slug));

  projects.forEach((project) => {
    project.services
      .filter((slug) => !serviceSlugs.has(slug))
      .forEach((slug) => problems.push(`projects, row ${project.slug}: services has "${slug}", which is not a service slug. Was it renamed or deleted?`));
  });

  const content = {
    site,
    home,
    seo,
    builtOn,
    services,
    projects,
    reviews: parseRows("reviews", reviewSchema, reviewsResult),
    promos: parseRows("promos", promoSchema, promosResult),
    faqs: parseRows("faqs", faqSchema, faqsResult),
    partners: parseRows("partners", partnerSchema, partnersResult),
    stats: parseRows("stats", statSchema, statsResult),
    hiringRoles: parseRows("hiring_roles", hiringRoleSchema, hiringResult),
  };

  if (site == null || home == null || seo == null || problems.length > 0) {
    throw new Error(`[zcars] Content is invalid. Fix these rows in the Supabase Table Editor and save again:\n\n${problems.join("\n\n")}`);
  }

  const photos = new Set([...projects.flatMap(({ gallery }) => gallery), ...services.flatMap(({ photo }) => (photo == null ? [] : [photo])), home.team_image]);

  return { ...content, site, home, seo, images: await resizeImages([...photos]) };
}

export default function content(): Plugin {
  let env: unknown;

  return {
    name: "zcars-content",
    enforce: "pre",
    configResolved(config) {
      env = config.env;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_ID) {
        return undefined;
      }

      const data = await loadContent(env);

      return Object.entries(data)
        .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
        .join("\n");
    },
  };
}
