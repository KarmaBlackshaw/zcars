import { z } from "zod";

import type { TFaq } from "./faq";
import type { THome } from "./home";
import type { TPartner } from "./partner";
import type { TProject } from "./project";
import type { TPromo } from "./promo";
import type { TReview } from "./review";
import type { TSeo } from "./seo";
import type { TService } from "./service";
import type { TSite } from "./site";

export const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9._~-]*$/);

export const textSchema = z.string().trim().min(1);

export const httpsUrlSchema = z.url({ protocol: /^https$/ });

export type TEntry<T> = T & { slug: string };

export type TContent = {
  site: TSite;
  home: THome;
  promo: TPromo;
  seo: TSeo;
  services: TEntry<TService>[];
  projects: TEntry<TProject>[];
  reviews: TEntry<TReview>[];
  faqs: TEntry<TFaq>[];
  partners: TEntry<TPartner>[];
};
