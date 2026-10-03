import { z } from "zod";

import { slugSchema, textSchema } from "./content";
import { imagePathSchema, photoSchema } from "./image";

export const projectSchema = z.strictObject({
  title: textSchema,
  vehicle: textSchema,
  services: z.array(slugSchema).default([]),
  after: imagePathSchema,
  after_alt: textSchema,
  before: photoSchema,
  completed_on: z.iso.date().optional(),
  order: z.number().int(),
});

export type TProject = z.infer<typeof projectSchema>;
