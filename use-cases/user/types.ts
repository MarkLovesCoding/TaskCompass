export type UserDto = {
  id: string;
  name: string;
  email?: string;
  projectsAsAdmin: string[];
  projectsAsMember: string[];
  teamsAsAdmin: string[];
  teamsAsMember: string[];
  tasks: string[];
  avatar: string;
};
export type User = { userId: string };
export type UserTeamsAsAdmin = string[];
export type UserTeamsAsMember = string[];

export type UpdateUser = (user: UserDto) => Promise<void>;
export type GetUser = () => User | undefined;
export type GetUserTeamsAsAdmin = (
  user: UserDto
) => UserTeamsAsAdmin | undefined;
export type GetUserTeamsAsMember = (
  user: UserDto
) => UserTeamsAsMember | undefined;
export type UpdateUserTeamsAsAdmin = (user: UserDto) => Promise<void>;
export type UpdateUserTeamsAsMember = (user: UserDto) => Promise<void>;
