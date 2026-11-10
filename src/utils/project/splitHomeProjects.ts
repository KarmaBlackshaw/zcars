import { HERO_PHOTO } from "@/constants/hero";

import type { TProject } from "@/types";

export const splitHomeProjects = (projects: TProject[]) => {
  const heroProject = projects.find(({ slug }) => slug === HERO_PHOTO.slug);
  const compareProject = projects.find((project) => project !== heroProject && project.before_photo != null);

  return {
    heroProject,
    compareProject,
    workProjects: projects.filter((project) => project !== heroProject && project !== compareProject),
  };
};
