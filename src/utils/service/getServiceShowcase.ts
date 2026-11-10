import type { TProject } from "../../types/project";
import type { TService } from "../../types/service";

export const getServiceShowcase = (service: TService, projects: TProject[]) => {
  const tagged = projects.filter(({ services }) => services.includes(service.slug));
  const project = tagged.at(0);
  const rest = tagged.slice(1);
  const compareProject = rest.find(({ before_photo }) => before_photo != null) ?? (project?.before_photo != null ? project : undefined);

  return {
    project,
    src: project?.photos[0] ?? service.photo,
    compareProject,
    workProjects: rest.filter((item) => item !== compareProject),
  };
};
