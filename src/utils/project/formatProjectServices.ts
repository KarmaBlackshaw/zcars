import type { TProject, TService } from "@/types";

export const formatProjectServices = (project: TProject, services: TService[]) =>
  services
    .filter(({ slug }) => project.services.includes(slug))
    .map(({ title }, index) => (index === 0 ? title : toMidSentence(title)))
    .join(", ");
