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
  const convertedUsers =
    project.users.length > 0
      ? project.users.map((user) => user.toString())
      : [];

  const convertedId = project._id.toString();
  const convertedTeam = project.team ? project.team.toString() : "";

  const plainifyColumnOrder = JSON.parse(JSON.stringify(project.columnOrder));
  const plainifyTasksOrder = JSON.parse(JSON.stringify(project.tasksOrder));
  return {
    id: convertedId,
    name: project.name,
    description: project.description,
    users: convertedUsers,
    tasks: convertedTasks,
    team: convertedTeam,
    createdBy: project.createdBy.toString(),
    archived: project.archived,
    backgroundImage: project.backgroundImage,
    tasksOrder: plainifyTasksOrder,
    columnOrder: plainifyColumnOrder,
  };
}
