import type { TProject, TService } from "@/types";

export const getProjectServices = (project: TProject, services: TService[]) => services.filter(({ slug }) => project.services.includes(slug));
