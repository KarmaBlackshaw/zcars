import { z } from "zod";

import { textSchema } from "./content";

export const faqItemSchema = z.object({
  question: textSchema,
  answer: textSchema.max(800),
});

export const faqSchema = faqItemSchema.extend({
  id: z.number().int(),
  position: z.number().int(),
});

export type TFaqItem = z.infer<typeof faqItemSchema>;
export type TFaq = z.infer<typeof faqSchema>;
