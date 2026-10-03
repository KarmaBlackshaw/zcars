import { z } from "zod";

import { textSchema } from "./content";

const linkSchema = z
  .strictObject({
    label: textSchema,
    href: z.string().regex(/^(#[\w-]+|https:\/\/\S+)$/),
  })
  .nullish()
  .transform((link) => link ?? undefined);

const bannerSchema = z
  .strictObject({
    text: textSchema.max(90),
    link: linkSchema,
    ends_on: z.iso.date().optional(),
  })
  .nullish()
  .transform((banner) => banner ?? undefined);

export const promoSchema = z.strictObject({ banner: bannerSchema });

export type TPromo = z.infer<typeof promoSchema>;
