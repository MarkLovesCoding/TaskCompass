export type UserDto = {
  id: string;
  name: string;
  email?: string;
  password?: string;
  projectsAsAdmin: string[];
  projectsAsMember: string[];
  teamsAsAdmin: string[];
  teamsAsMember: string[];
  tasks: string[];
  avatar: string;
  backgroundImage: string;
  resetToken?: string;
  resetTokenExpiry?: number;
};
export type User = { userId: string };
export type UserTeamsAsAdmin = string[];
export type UserTeamsAsMember = string[];

export type UpdateUser = (user: UserDto) => Promise<void>;
export type CreateNewEmailUser = (values: {
  name: string;
  email: string;
  password: string;
  role: string;
  firstLogIn: boolean;
}) => Promise<UserDto>;

export type GetUser = (userId: string) => Promise<UserDto>;
export type GetUserByEmail = (email: string) => Promise<UserDto>;
export type GetUserByResetToken = (token: string) => Promise<UserDto>;
export type GetProjectUsers = (userIds: string[]) => Promise<UserDto[]>;
export type GetUserSession = () => User | undefined;
export type GetUserTeamsAsAdmin = (
  user: UserDto
) => UserTeamsAsAdmin | undefined;
export type GetUserTeamsAsMember = (
  user: UserDto
) => UserTeamsAsMember | undefined;
export type UpdateUserTeamsAsAdmin = (user: UserDto) => Promise<void>;
export type UpdateUserTeamsAsMember = (user: UserDto) => Promise<void>;
