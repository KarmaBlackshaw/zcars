import { z } from "zod";

import { textSchema } from "./content";

export const statSchema = z.object({
  id: z.number().int(),
  value: textSchema,
  label: textSchema,
  position: z.number().int(),
});

export type TStat = z.infer<typeof statSchema>;
