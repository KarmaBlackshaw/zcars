import { z } from "zod";

import { textSchema } from "./content";

export const promoSchema = z
  .strictObject({
    is_enabled: z.boolean(),
    text: textSchema.max(90).optional(),
    link_label: textSchema.optional(),
    link_href: z
      .string()
      .regex(/^(#[\w-]+|https:\/\/\S+)$/)
      .optional(),
    ends_on: z.iso.date().optional(),
  })
  .refine((promo) => !promo.is_enabled || promo.text != null, {
    path: ["text"],
    error: "Add the banner text, or turn the banner off.",
  })
  .refine((promo) => (promo.link_label == null) === (promo.link_href == null), {
    path: ["link_href"],
    error: "Set both the link label and the link, or neither.",
  });

export type TPromo = z.infer<typeof promoSchema>;
