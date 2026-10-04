import { z } from "zod";

import { textSchema } from "./content";
import { imagePathSchema } from "./image";

const stepSchema = z.strictObject({ title: textSchema, text: textSchema });

export const homeSchema = z.strictObject({
  hero: z.strictObject({
    title: textSchema,
    title_accent: textSchema,
    lead: textSchema.max(160),
    image: imagePathSchema,
  }),
  services: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema, lead: textSchema.optional() }),
  promos: z.strictObject({ title: textSchema, lead: textSchema.optional() }),
  projects: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema, lead: textSchema.optional() }),
  how: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema, steps: z.array(stepSchema).length(3) }),
  repaint: z.strictObject({
    eyebrow: textSchema.optional(),
    title: textSchema,
    lead: textSchema,
    image: imagePathSchema,
    steps: z.array(stepSchema).min(1).max(4),
  }),
  trust: z.strictObject({
    stats: z
      .array(z.strictObject({ value: textSchema, label: textSchema }))
      .max(4)
      .default([]),
    warranty: z
      .strictObject({ title: textSchema, text: textSchema.max(160) })
      .nullish()
      .transform((warranty) => warranty ?? undefined),
  }),
  reviews: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema }),
  partners: z.strictObject({ eyebrow: textSchema.optional() }),
  faq: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema }),
  quote: z.strictObject({
    eyebrow: textSchema.optional(),
    title: textSchema,
    lead: textSchema.optional(),
    reply_time: textSchema.optional(),
  }),
  visit: z.strictObject({ eyebrow: textSchema.optional(), title: textSchema, lead: textSchema.optional() }),
  team: z.strictObject({
    eyebrow: textSchema.optional(),
    title: textSchema,
    lead: textSchema,
    image: imagePathSchema,
    caption: textSchema.optional(),
  }),
  hiring: z.strictObject({
    is_hiring: z.boolean(),
    roles: z.array(z.strictObject({ name: textSchema, level: textSchema })).default([]),
    text: textSchema,
  }),
});

export type THome = z.infer<typeof homeSchema>;
