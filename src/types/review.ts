import { z } from "zod";

import { httpsUrlSchema, textSchema } from "./content";

const reviewSourceSchema = z.enum(["facebook", "google", "in-person"]);

export type TReviewSource = z.infer<typeof reviewSourceSchema>;

export const reviewSchema = z.strictObject({
  name: textSchema,
  vehicle: textSchema.optional(),
  rating: z.number().int().min(1).max(5),
  quote: textSchema.max(400),
  source: reviewSourceSchema,
  source_url: httpsUrlSchema.optional(),
  date: z.iso.date(),
});

export type TReview = z.infer<typeof reviewSchema>;
