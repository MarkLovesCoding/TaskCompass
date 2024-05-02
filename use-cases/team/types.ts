import type { TInvitedUser } from "@/entities/Team";
import { Project } from "next/dist/build/swc";
import { ProjectDto } from "../project/types";
import { UserDto } from "../user/types";
export type TeamDto = {
  id: string;
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  invitedUsers: TInvitedUser[];
};
export type CreateTeamDto = {
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  invitedUsers: TInvitedUser[];
};
export type UpdateTeamUsers = (
  teamId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;
export type UpdateTeamInvitedUsers = (
  teamId: string,
  invitedUser: TInvitedUser,
  updateType: "add" | "remove"
) => Promise<void>;
export type GetTeam = (teamId: string) => Promise<TeamDto>;
export type CreateNewTeam = (
  team: CreateTeamDto,
  userId: string
) => Promise<void>;
export type CreateDefaultTeam = (team: CreateTeamDto) => Promise<TeamDto>;

export type UpdateTeam = (team: TeamDto) => Promise<void>;
