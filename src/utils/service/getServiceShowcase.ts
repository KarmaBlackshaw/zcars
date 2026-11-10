import type { TProject } from "../../types/project";
import type { TService } from "../../types/service";

export const getServiceShowcase = (service: TService, projects: TProject[]) => {
  const tagged = projects.filter(({ services }) => services.includes(service.slug));
  const project = tagged.at(0);

  return { project, src: project?.photos[0] ?? service.photo, workProjects: tagged.slice(1) };
};
