import { z } from "zod";

import { textSchema } from "./content";

export const imagePathSchema = z.string().regex(/^\/uploads\/[A-Za-z0-9._-]+$/, {
  error: "Must be an image uploaded in the CMS (/uploads/...)",
});

export const photoSchema = z.strictObject({ image: imagePathSchema, alt: textSchema });
