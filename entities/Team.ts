import { ZodError, z } from "zod";

export type TInvitedUser = {
  teamId: string;
  email: string;
  role: string;
  inviteUserToken: string;
  inviteUserTokenExpires: number;
};
type ValidatedFields =
  | "id"
  | "name"
  | "users"
  | "projects"
  | "createdBy"
  | "backgroundImage"
  | "backgroundImageThumbnail"
  | "invitedUsers";

export class TeamEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an team entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class TeamEntity {
  private id?: string;
  private name: string;
  private users: string[];
  private projects: string[];
  private createdBy: string;
  private backgroundImage: string;
  private backgroundImageThumbnail: string;
  private invitedUsers: TInvitedUser[];

  constructor({
    id,
    name,
    users,
    projects,
    createdBy,
    backgroundImage,
    backgroundImageThumbnail,
    invitedUsers,
  }: {
    id?: string;
    name: string;
    users: string[];
    projects: string[];
    createdBy: string;
    backgroundImage: string;
    backgroundImageThumbnail: string;
    invitedUsers: TInvitedUser[];
  }) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.projects = projects;
    this.createdBy = createdBy;
    this.backgroundImage = backgroundImage;
    this.backgroundImageThumbnail = backgroundImageThumbnail;
    this.invitedUsers = invitedUsers;
    this.validate();
  }

  getName() {
    return this.name;
  }

  getUsers() {
    return this.users;
  }

  getProjects() {
    return this.projects;
  }

  getId() {
    return this.id;
  }

  getCreatedBy() {
    return this.createdBy;
  }

  getBackgroundImage() {
    return this.backgroundImage;
  }

  getBackgroundImageThumbnail() {
    return this.backgroundImageThumbnail;
  }

  getInvitedUsers() {
    return this.invitedUsers;
  }

  removeExpiredInvitedUsers() {
    this.invitedUsers = this.invitedUsers?.filter(
      (invitedUser) => invitedUser.inviteUserTokenExpires > Date.now()
    );
  }

  addInvitedUser(invitedUser: TInvitedUser) {
    //check if user is already invited
    const existingInvitedUser = this.invitedUsers?.find(
      (invitedUser) => invitedUser.email === invitedUser.email
    );
    if (existingInvitedUser) {
      //update the existing invited user
      existingInvitedUser.inviteUserToken = invitedUser.inviteUserToken;
      existingInvitedUser.inviteUserTokenExpires =
        invitedUser.inviteUserTokenExpires;
    } else {
      this.invitedUsers?.push(invitedUser);
    }
  }

  removeInvitedUser(invitedUser: TInvitedUser) {
    this.invitedUsers = this.invitedUsers?.filter(
      (invitedUser) => invitedUser.email !== invitedUser.email
    );
  }

  addUser(user: string) {
    this.users.push(user);
  }

  removeUser(user: string) {
    if (user !== this.createdBy) {
      this.users = this.users.filter((m) => m !== user);
    }
  }

  addUsers(users: string[]) {
    users.forEach((user) => {
      this.users.push(user);
    });
  }

  removeUsers(users: string[]) {
    users.forEach((user) => {
      if (user !== this.createdBy) {
        this.users = this.users.filter((a) => a !== user);
      }
    });
  }

  updateUsers(users: string[]) {
    this.users = users;
  }

  addProject(project: string) {
    this.projects.push(project);
  }

  updateName(name: string) {
    this.name = name;
  }

  updateBackgroundImage(backgroundImage: string) {
    this.backgroundImage = backgroundImage;
  }

  updateBackgroundImageThumbnail(backgroundImageThumbnail: string) {
    this.backgroundImageThumbnail = backgroundImageThumbnail;
  }

  private validate() {
    const teamSchema = z.object({
      name: z.string().min(3).max(50),
      users: z.array(z.string()).min(0),
      projects: z.array(z.string()).optional(),
      createdBy: z.string(),
      backgroundImage: z.string().optional(),
      backgroundImageThumbnail: z.string().optional(),
    });
    try {
      teamSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new TeamEntityValidationError({
        id: errors.id?.[0],
        name: errors.name?.[0],
        users: errors.users?.[0],
        projects: errors.projects?.[0],
        createdBy: errors.createdBy?.[0],
        backgroundImage: errors.backgroundImage?.[0],
        backgroundImageThumbnail: errors.backgroundImageThumbnail?.[0],
        invitedUsers: errors.invitedUsers?.[0],
      });
    }
  }
}
