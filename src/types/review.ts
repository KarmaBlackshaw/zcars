import { z } from "zod";

import { httpsUrlSchema, optionalSchema, textSchema } from "./content";

const reviewSourceSchema = z.enum(["facebook", "google", "in-person"]);

export type TReviewSource = z.infer<typeof reviewSourceSchema>;

export const reviewSchema = z.object({
  id: z.number().int(),
  name: textSchema,
  vehicle: optionalSchema(textSchema),
  rating: z.number().int().min(1).max(5),
  quote: textSchema.max(400),
  source: reviewSourceSchema,
  source_url: optionalSchema(httpsUrlSchema),
  reviewed_on: z.iso.date(),
});

export type TReview = z.infer<typeof reviewSchema>;
