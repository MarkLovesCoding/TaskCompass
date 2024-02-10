export type UserDto = {
  id: string;
  name: string;
  email?: string;
  projects: string[];
  teams: string[];
  tasks: string[];
  avatar: string;
};
export type User = { userId: string };
export type UserTeams = string[];

export type UpdateUser = (user: UserDto) => Promise<void>;
export type GetUser = () => User | undefined;
export type GetUserTeams = (user: UserDto) => UserTeams | undefined;
export type UpdateUserTeams = (user: UserDto) => Promise<void>;
