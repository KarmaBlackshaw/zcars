import { z } from "zod";

import { httpsUrlSchema, optionalSchema, slugSchema, textSchema } from "./content";

export const projectSchema = z
  .object({
    slug: slugSchema,
    title: textSchema,
    vehicle: textSchema,
    services: z.array(slugSchema),
    photos: z.array(httpsUrlSchema).min(1),
    before_photo: optionalSchema(httpsUrlSchema),
    completed_on: optionalSchema(z.iso.date()),
  })
  .transform((project) => ({
    ...project,
    gallery: project.before_photo == null ? project.photos : [...project.photos, project.before_photo],
  }));

export type TProject = z.infer<typeof projectSchema>;
