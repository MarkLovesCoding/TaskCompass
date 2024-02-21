import { ProjectEntity } from "@/entities/Project";
import { ProjectDto, CreateProjectDto } from "@/use-cases/project/types";

export function projectToDto(project: ProjectEntity): ProjectDto {
  const projectId = project.getId();
  if (!projectId) throw new Error("Project id is required");
  return {
    id: projectId,
    name: project.getName(),
    description: project.getDescription(),
    members: project.getMembers(),
    tasks: project.getTasks(),
    team: project.getTeam(),
    archived: project.getArchived(),
  };
}

export function projectToCreateProjectDto(
  project: ProjectEntity
): CreateProjectDto {
  return {
    name: project.getName(),
    description: project.getDescription(),
    members: project.getMembers(),
    tasks: project.getTasks(),
    team: project.getTeam(),
    archived: project.getArchived(),
  };
}
