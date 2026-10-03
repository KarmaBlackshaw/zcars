import { z } from "zod";

import { textSchema } from "./content";

export const faqSchema = z.strictObject({
  question: textSchema,
  answer: textSchema.max(800),
  order: z.number().int(),
});

export type TFaq = z.infer<typeof faqSchema>;
