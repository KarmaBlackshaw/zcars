import { z } from "zod";

import { slugSchema, textSchema } from "./content";
import { imagePathSchema } from "./image";

export const projectSchema = z
  .strictObject({
    title: textSchema,
    vehicle: textSchema,
    services: z.array(slugSchema).default([]),
    after: imagePathSchema,
    after_alt: textSchema,
    before: imagePathSchema.optional(),
    before_alt: textSchema.optional(),
    completed_on: z.iso.date().optional(),
    order: z.number().int(),
  })
  .refine((project) => project.before == null || project.before_alt != null, {
    path: ["before_alt"],
    error: "Describe the before photo for people who cannot see it.",
  });

export type TProject = z.infer<typeof projectSchema>;
