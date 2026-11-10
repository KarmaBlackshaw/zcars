import { faqs, projects, reviews, services } from "virtual:content";

import type { TNavLink } from "@/types";

export function useNavLinks() {
  const links: TNavLink[] = [{ label: "Home", href: "/" }];

  if (services.length > 0) {
    links.push({ label: "Services", href: "/#services" });
  }

  if (splitHomeProjects(projects).workProjects.length > 0) {
    links.push({ label: "Work", href: "/#work" });
  }

  links.push({ label: "Process", href: "/#process" });

  if (getLinkedReviews(reviews).length > 0) {
    links.push({ label: "Reviews", href: "/#reviews" });
  }

  links.push({ label: "Visit", href: "/#visit" });

  if (faqs.length > 0) {
    links.push({ label: "FAQ", href: "/#faq" });
  }

  return links;
}
