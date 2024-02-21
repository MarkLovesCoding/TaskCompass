import type { ProjectModelType } from "./types";
import type { ProjectDto } from "@/use-cases/project/types";
//explicitly convert bson objects to strings for prop injection
export function projectModelToProjectDto(
  project: ProjectModelType
): ProjectDto {
  const convertedTasks =
    project.tasks.length > 0
      ? project.tasks.map((task) => task.toString())
      : [];
  const convertedMembers =
    project.members.length > 0
      ? project.members.map((member) => member.toString())
      : [];
  const convertedId = project._id.toString();
  const convertedTeam = project.team ? project.team.toString() : "";
  return {
    id: convertedId,
    name: project.name,
    description: project.description,
    members: convertedMembers,
    tasks: convertedTasks,
    team: convertedTeam,
    archived: project.archived,
  };
}
