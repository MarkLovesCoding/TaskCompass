import crypto from "crypto";

import { TInvitedUser, TeamEntity } from "@/entities/Team";
import { ValidationError } from "../utils";
import type { CreateNewEmailUser, UpdateUser } from "./types";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, CreateDefaultProject } from "../project/types";
import { projectToCreateProjectDto, projectToDto } from "../project/utils";
import { UpdateTeam, CreateDefaultTeam } from "../team/types";
import { UserEntity } from "@/entities/User";
import { userToDto } from "./utils";
import { teamToCreateTeamDto, teamToDto } from "../team/utils";
import bcrypt from "bcrypt";
//******************************************
//This function creates new user from email,
//then sets up default teams and projects for the user

//******************************************
export async function createNewEmailUserUseCase(
  context: {
    createDefaultTeam: CreateDefaultTeam;
    createNewEmailUser: CreateNewEmailUser;
    createDefaultProject: CreateDefaultProject;
    updateUser: UpdateUser;
    updateTeam: UpdateTeam;
    updateProject: UpdateProject;
  },
  data: {
    values: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
      role: string;
      firstLogIn: boolean;
    };
  }
) {
  //****************************************
  // Check if team exists
  // Retrieve Team Entity & Gather Team and Invite Data
  //

  const hashPassword: string = await bcrypt.hash(data.values.password, 12);

  let newUser = await context.createNewEmailUser({
    name: data.values.name,
    email: data.values.email,
    password: hashPassword,
    role: data.values.role,
    firstLogIn: data.values.firstLogIn,
  });

  if (!newUser) throw new Error("Error creating user");

  // CHECKS IF MANUALLY ADDED USER IS FIRST TIME LOGGING IN>
  if (newUser) {
    const newUserId: string = newUser.id;
    const newTeamData = {
      name: `${newUser.name}'s First Team`,
      users: [newUserId],
      projects: [],
      createdBy: newUserId,
      backgroundImage: "",
      backgroundImageThumbnail: "",
      invitedUsers: [],
    };
    const newTeam = new TeamEntity({
      ...newTeamData,
    });

    let initialTeamAssigned = await context.createDefaultTeam(
      teamToCreateTeamDto(newTeam)
    );

    if (!initialTeamAssigned) throw new Error("Error creating default team");

    const newProjectData = {
      name: `${newUser.name}'s First Project`,
      description: "",
      archived: false,
      createdBy: newUser.id,
      users: [newUser.id],
      team: initialTeamAssigned.id,
      tasks: [],
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
      backgroundImage: "",
      backgroundImageThumbnail: "",
    };

    const newProject = new ProjectEntity({ ...newProjectData });

    try {
      //CREATE NEW PROJECT WITH FILLER NAMES
      let initialProjectAssigned = await context.createDefaultProject(
        projectToCreateProjectDto(newProject)
      );
      if (!initialProjectAssigned)
        throw new Error("Error creating default project");
      //CREATE NEW USER

      //CREATE NEW TEAM WITH FILLER NAME

      //establish entities
      const newUserEntity = new UserEntity(newUser);
      const initialProjectEntity = new ProjectEntity(initialProjectAssigned);
      const initialTeamEntity = new TeamEntity(initialTeamAssigned);
      newUserEntity.addProjectAsAdmin(initialProjectAssigned.id);
      newUserEntity.addTeamAsAdmin(initialTeamAssigned.id);
      await context.updateUser(userToDto(newUserEntity));

      initialProjectEntity.setTeam(initialTeamAssigned.id);
      await context.updateProject(projectToDto(initialProjectEntity));

      initialTeamEntity.addProject(initialProjectAssigned.id);
      await context.updateTeam(teamToDto(initialTeamEntity));
    } catch (error) {
      console.error("Error saving User or default teams/projects:", error);
      // return false;

      // Handle the error or return from the function as needed
    }
    return;
  }
}
