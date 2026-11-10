import { z } from "zod";

import { httpsUrlSchema, textSchema } from "./content";

export const seoSchema = z.object({
  id: z.literal(true),
  title: textSchema,
  description: textSchema.max(160),
  og_title: textSchema,
  og_description: textSchema.max(200),
  og_image: httpsUrlSchema,
});

export type TSeo = z.infer<typeof seoSchema>;
