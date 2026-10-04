import { z } from "zod";

import { textSchema } from "./content";
import { imagePathSchema } from "./image";

const serviceIconSchema = z.enum(["spray-bottle", "sparkle", "shield-check", "hammer", "paint-roller", "wrench", "sun-dim", "umbrella"]);

export type TServiceIcon = z.infer<typeof serviceIconSchema>;

const optionalNumber = z
  .number()
  .int()
  .min(0)
  .nullish()
  .transform((value) => value ?? undefined);

export const serviceSchema = z.strictObject({
  title: textSchema,
  summary: textSchema.max(120),
  price_from: optionalNumber,
  price_note: textSchema.optional(),
  photo: imagePathSchema.nullish().transform((photo) => photo ?? undefined),
  icon: serviceIconSchema,
  order: z.number().int(),
});

export type TService = z.infer<typeof serviceSchema>;
