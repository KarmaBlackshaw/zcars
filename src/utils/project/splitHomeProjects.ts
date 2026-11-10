import type { TProject } from "@/types";

export const splitHomeProjects = (projects: TProject[]) => {
  const pairs = projects.filter(({ before_photo }) => before_photo != null);
  const heroProjects = pairs.length > 0 ? pairs : projects.slice(0, 1);

  return { heroProjects, workProjects: projects.filter((project) => !heroProjects.includes(project)) };
};
