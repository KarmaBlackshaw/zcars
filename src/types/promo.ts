import { z } from "zod";

import { httpsUrlSchema, optionalSchema, slugSchema, textSchema } from "./content";

export const promoSchema = z.object({
  id: z.number().int(),
  title: textSchema.max(60),
  text: textSchema.max(200),
  price_label: optionalSchema(textSchema.max(24)),
  photo: optionalSchema(httpsUrlSchema),
  service: optionalSchema(slugSchema),
  starts_on: optionalSchema(z.iso.date()),
  ends_on: optionalSchema(z.iso.date()),
  position: z.number().int(),
});

export type TPromo = z.infer<typeof promoSchema>;
