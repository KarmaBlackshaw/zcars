import { z } from "zod";

import { slugSchema, textSchema } from "./content";
import { imagePathSchema } from "./image";

export const projectSchema = z.strictObject({
  title: textSchema,
  vehicle: textSchema,
  services: z.array(slugSchema).default([]),
  photos: z.tuple([imagePathSchema], imagePathSchema),
  completed_on: z.iso.date().optional(),
});

export type TProject = z.infer<typeof projectSchema>;
