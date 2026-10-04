/// <reference types="vite/client" />

declare module "virtual:content" {
  import type { TContent } from "@/types/content";

  export const site: TContent["site"];
  export const home: TContent["home"];
  export const promos: TContent["promos"];
  export const builtOn: TContent["builtOn"];
  export const seo: TContent["seo"];
  export const services: TContent["services"];
  export const projects: TContent["projects"];
  export const reviews: TContent["reviews"];
  export const faqs: TContent["faqs"];
  export const partners: TContent["partners"];
}
