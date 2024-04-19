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
    backgroundImage: "",
    backgroundImageThumbnail: "",
    createdBy: user.userId,
    tasksOrder: {
      priority: { High: [], Medium: [], Low: [] },
      status: {
        "Not Started": [],
        "Up Next": [],
        "In Progress": [],
        Completed: [],
      },
      category: {
        Household: [],
        Personal: [],
        Work: [],
        School: [],
        Other: [],
      },
    },
    columnOrder: {
      priority: ["High", "Medium", "Low"],
      status: ["Not Started", "Up Next", "In Progress", "Completed"],
      category: ["Household", "Personal", "Work", "School", "Other"],
    },
  });
  console.log("____________newProject", newProject);
  await context.createNewProject(
    projectToCreateProjectDto(newProject),
    user.userId
  );
}
