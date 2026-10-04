import { z } from "zod";

import { slugSchema, textSchema } from "./content";
import { imagePathSchema } from "./image";

export const promoSchema = z
  .strictObject({
    title: textSchema.max(60),
    text: textSchema.max(200),
    price_label: textSchema.max(24).optional(),
    photo: imagePathSchema.nullish().transform((photo) => photo ?? undefined),
    service: slugSchema.optional(),
    starts_on: z.iso.date().optional(),
    ends_on: z.iso.date().optional(),
  })
  .refine((promo) => promo.starts_on == null || promo.ends_on == null || promo.starts_on <= promo.ends_on, {
    error: "The start date must be on or before the end date",
    path: ["ends_on"],
  });

export const promosSchema = z.strictObject({ promos: z.array(promoSchema).default([]) });

export type TPromo = z.infer<typeof promoSchema>;
