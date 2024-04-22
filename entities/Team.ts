import { ZodError, z } from "zod";

type ValidatedFields =
  | "id"
  | "name"
  | "users"
  | "projects"
  | "createdBy"
  | "backgroundImage"
  | "backgroundImageThumbnail";

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

  constructor({
    id,
    name,
    users,
    projects,
    createdBy,
    backgroundImage,
    backgroundImageThumbnail,
  }: {
    id?: string;
    name: string;
    users: string[];
    projects: string[];
    createdBy: string;
    backgroundImage: string;
    backgroundImageThumbnail: string;
  }) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.projects = projects;
    this.createdBy = createdBy;
    this.backgroundImage = backgroundImage;
    this.backgroundImageThumbnail = backgroundImageThumbnail;
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
      name: z.string().min(3).max(30),
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
      });
    }
  }
}
