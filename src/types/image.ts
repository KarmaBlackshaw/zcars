import { z } from "zod";

export const imagePathSchema = z.string().regex(/^\/uploads\/[A-Za-z0-9._-]+$/, {
  error: "Must be an image uploaded in the CMS (/uploads/...)",
});
