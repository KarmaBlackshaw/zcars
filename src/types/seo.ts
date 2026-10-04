import { z } from "zod";

import { textSchema } from "./content";
import { imagePathSchema } from "./image";

export const seoSchema = z.strictObject({
  title: textSchema,
  description: textSchema.max(160),
  og_title: textSchema,
  og_description: textSchema.max(200),
  og_image: imagePathSchema,
});

export type TSeo = z.infer<typeof seoSchema>;
