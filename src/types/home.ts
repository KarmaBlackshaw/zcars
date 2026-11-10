import { z } from "zod";

import { httpsUrlSchema, optionalSchema, textSchema } from "./content";

export const homeSchema = z.object({
  id: z.literal(true),
  hero_heading: textSchema,
  hero_title: textSchema,
  hero_title_accent: optionalSchema(textSchema),
  hero_lead: textSchema.max(160),
  services_title: textSchema,
  services_lead: optionalSchema(textSchema),
  work_title: textSchema,
  work_lead: optionalSchema(textSchema),
  reviews_title: textSchema,
  promos_title: textSchema,
  promos_lead: optionalSchema(textSchema),
  faq_title: textSchema,
  contact_title: textSchema,
  contact_lead: optionalSchema(textSchema),
  reply_time: optionalSchema(textSchema),
  partners_title: optionalSchema(textSchema),
  warranty_title: optionalSchema(textSchema),
  warranty_text: optionalSchema(textSchema.max(160)),
  team_title: textSchema,
  team_lead: textSchema,
  team_image: httpsUrlSchema,
  team_caption: optionalSchema(textSchema),
  hiring_text: optionalSchema(textSchema),
});

export type THome = z.infer<typeof homeSchema>;
