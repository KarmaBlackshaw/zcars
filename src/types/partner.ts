import { z } from "zod";

import { textSchema } from "./content";
import { imagePathSchema } from "./image";

export const partnerSchema = z.strictObject({
  name: textSchema,
  logo: imagePathSchema,
});

export type TPartner = z.infer<typeof partnerSchema>;
