import { ProjectEntity } from "@/entities/Project";
import { ProjectDto, CreateProjectDto } from "@/use-cases/project/types";

export function projectToDto(project: ProjectEntity): ProjectDto {
  const projectId = project.getId();
  if (!projectId) throw new Error("Project id is required");
  return {
    id: project.getId(),
    name: project.getName(),
    description: project.getDescription(),
    members: project.getMembers(),
    tasks: project.getTasks(),
  };
}

export function projectToCreateProjectDto(
  project: ProjectEntity
): CreateProjectDto {
  return {
    name: project.getName(),
    description: project.getDescription(),
  };
}
