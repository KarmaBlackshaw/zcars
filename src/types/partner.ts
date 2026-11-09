import { z } from "zod";

import { httpsUrlSchema, slugSchema, textSchema } from "./content";

export const partnerSchema = z.object({
  slug: slugSchema,
  name: textSchema,
  logo: httpsUrlSchema,
});

export type TPartner = z.infer<typeof partnerSchema>;
