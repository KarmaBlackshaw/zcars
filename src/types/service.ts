import { z } from "zod";

import { httpsUrlSchema, optionalSchema, slugSchema, textSchema } from "./content";

const serviceIconSchema = z.enum(["spray-bottle", "sparkle", "shield-check", "hammer", "paint-roller", "wrench", "sun-dim", "umbrella"]);

export type TServiceIcon = z.infer<typeof serviceIconSchema>;

export const serviceSchema = z.object({
  slug: slugSchema,
  title: textSchema,
  summary: textSchema.max(140),
  price_from: optionalSchema(z.number().int().min(0)),
  price_note: optionalSchema(textSchema),
  photo: optionalSchema(httpsUrlSchema),
  icon: serviceIconSchema,
  position: z.number().int(),
});

export type TService = z.infer<typeof serviceSchema>;
