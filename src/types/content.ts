import { z } from "zod";

import type { TFaq } from "./faq";
import type { THiringRole } from "./hiring";
import type { THome } from "./home";
import type { TImage } from "./image";
import type { TPartner } from "./partner";
import type { TProject } from "./project";
import type { TPromo } from "./promo";
import type { TReview } from "./review";
import type { TSeo } from "./seo";
import type { TService } from "./service";
import type { TSite } from "./site";
import type { TStat } from "./stat";

export const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
export const textSchema = z.string().trim().min(1);
export const httpsUrlSchema = z.url({ protocol: /^https$/ });

export const optionalSchema = <T extends z.ZodType>(schema: T) => schema.nullish().transform((value) => value ?? undefined);

export type TContent = {
  site: TSite;
  home: THome;
  promos: TPromo[];
  builtOn: string;
  seo: TSeo;
  services: TService[];
  projects: TProject[];
  reviews: TReview[];
  faqs: TFaq[];
  partners: TPartner[];
  stats: TStat[];
  hiringRoles: THiringRole[];
  images: Partial<Record<string, TImage>>;
};
