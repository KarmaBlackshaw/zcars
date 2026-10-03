import { faqs, projects, reviews, services } from "virtual:content";

import type { TNavLink } from "@/types";

export function useNavLinks() {
  const links: TNavLink[] = [];

  if (services.length > 0) {
    links.push({ label: "Services", href: "#services" });
  }

  if (projects.length > 0) {
    links.push({ label: "Work", href: "#work" });
  }

  if (reviews.length > 0) {
    links.push({ label: "Reviews", href: "#reviews" });
  }

  if (faqs.length > 0) {
    links.push({ label: "FAQ", href: "#faq" });
  }

  links.push({ label: "Visit", href: "#visit" });

  return links;
}
