import { z } from "zod";

import { textSchema } from "./content";

export const faqSchema = z.strictObject({
  question: textSchema,
  answer: textSchema.max(800),
});

export const faqsSchema = z.strictObject({ questions: z.array(faqSchema).default([]) });

export type TFaq = z.infer<typeof faqSchema>;
