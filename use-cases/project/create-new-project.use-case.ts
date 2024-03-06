import { ProjectEntity } from "@/entities/Project";
import { CreateNewProject } from "@/use-cases/project/types";

import { GetUserSession } from "@/use-cases/user/types";
import { projectToCreateProjectDto } from "@/use-cases/project/utils";

// to be sorted out with how to update team and user and impliment
export async function createNewProjectUseCase(
  context: {
    createNewProject: CreateNewProject;
    getUser: GetUserSession;
  },
  data: {
    name: string;
    description: string;
    teamId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");

  const newProject = new ProjectEntity({
    name: data.name,
    description: data.description,
    users: [user.userId],
    tasks: [],
    team: data.teamId,
    archived: false,
    createdBy: user.userId,
    listsNextAvailable: {
      priority: { High: 1, Medium: 1, Low: 1 },
      status: {
        "Not Started": 1,
        "Up Next": 1,
        "In Progress": 1,
        Completed: 1,
      },
      category: { Household: 1, Personal: 1, Work: 1, School: 1, Other: 1 },
    },
  });
  console.log("____________newProject", newProject);
  await context.createNewProject(
    projectToCreateProjectDto(newProject),
    user.userId
  );
}
