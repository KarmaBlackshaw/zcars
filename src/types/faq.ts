import { z } from "zod";

import { textSchema } from "./content";

export const faqSchema = z.object({
  id: z.number().int(),
  question: textSchema,
  answer: textSchema.max(800),
  position: z.number().int(),
});

export type TFaq = z.infer<typeof faqSchema>;
