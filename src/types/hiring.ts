import { z } from "zod";

import { textSchema } from "./content";

export const hiringRoleSchema = z.object({
  id: z.number().int(),
  name: textSchema,
  level: textSchema,
  position: z.number().int(),
});

export type THiringRole = z.infer<typeof hiringRoleSchema>;
