import type { TProject } from "@/types";

export const splitHomeProjects = (projects: TProject[]) => {
  const heroProject = projects.find(({ before_photo }) => before_photo != null) ?? projects.at(0);

  return { heroProject, workProjects: projects.filter((project) => project !== heroProject) };
};
