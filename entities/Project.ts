import { ZodError, z } from "zod";

type ValidatedFields =
  | "id"
  | "name"
  | "description"
  | "users"
  | "tasks"
  | "team"
  | "createdBy"
  | "archived"
  | "columnOrder"
  | "tasksOrder"
  | "backgroundImage"
  | "backgroundImageThumbnail";

export class ProjectEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an project entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export type ListsNextAvailable = Record<string, Record<string, number>>;
export type TasksOrder = Record<string, Record<string, string[]>>;
export type ColumnOrder = Record<string, string[]>;
export class ProjectEntity {
  private id?: string;
  private name: string;
  private description: string;
  private users: string[];
  private tasks: string[];
  private team: string;
  private createdBy: string;
  private archived: boolean;
  private columnOrder: ColumnOrder;
  private tasksOrder: TasksOrder;
  private backgroundImage: string;
  private backgroundImageThumbnail: string;
  constructor({
    id,
    name,
    description,
    users,
    tasks,
    team,
    createdBy,
    archived = false,
    columnOrder,
    tasksOrder,
    backgroundImage,
    backgroundImageThumbnail,
  }: {
    id?: string;
    name: string;
    description: string;
    users: string[];
    tasks: string[];
    team: string;
    createdBy: string;
    archived: boolean;
    columnOrder: ColumnOrder;
    tasksOrder: TasksOrder;
    backgroundImage: string;
    backgroundImageThumbnail: string;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.users = users;
    this.tasks = tasks;
    this.team = team;
    this.createdBy = createdBy;
    this.archived = archived;
    this.columnOrder = columnOrder;
    this.tasksOrder = tasksOrder;
    this.backgroundImage = backgroundImage;
    this.backgroundImageThumbnail = backgroundImageThumbnail;
    this.validate();
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getTasks() {
    return this.tasks;
  }

  getTeam() {
    return this.team;
  }

  getId() {
    return this.id;
  }

  getArchived() {
    return this.archived;
  }

  getUsers() {
    return this.users;
  }

  getCreatedBy() {
    return this.createdBy;
  }

  getColumnOrder() {
    return this.columnOrder;
  }

  getTasksOrder() {
    return this.tasksOrder;
  }

  getBackgroundImage() {
    return this.backgroundImage;
  }

  getBackgroundImageThumbnail() {
    return this.backgroundImageThumbnail;
  }

  setTeam(team: string) {
    this.team = team;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy;
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
    //make sure no duplicates
    users.forEach((user) => {
      this.users.push(user);
    });
    const usersSet = new Set(this.users);
    this.users = Array.from(usersSet);
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

  updateArchived(archived: boolean) {
    this.archived = archived;
  }

  updateBackgroundImage(backgroundImage: string) {
    this.backgroundImage = backgroundImage;
  }

  updateBackgroundImageThumbnail(backgroundImageThumbnail: string) {
    this.backgroundImageThumbnail = backgroundImageThumbnail;
  }

  addTask(taskId: string) {
    this.tasks.push(taskId);
  }
  
  removeTask(taskId: string) {
    this.tasks = this.tasks.filter((t) => t !== taskId);
  } 

  updateName(name: string) {
    this.name = name;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  updateColumnOrder(columnOrder: ColumnOrder) {
    this.columnOrder = columnOrder;
  }

  updateTasksOrder(
    taskId: string,
    type: string,
    newSubType: string,
    existingSubType: string
  ) {
    const existingTasksOrder = this.getTasksOrder();
    const newTasksOrder = { ...existingTasksOrder };
    for (const key in newTasksOrder) {
      if (key === type) {
        newTasksOrder[type][newSubType].push(taskId);
        newTasksOrder[type][existingSubType] = newTasksOrder[type][
          existingSubType
        ].filter((t) => t !== taskId);
      }
    }
    this.tasksOrder = newTasksOrder;
  }

  updateTeam(team: string) {
    this.team = team;
  }

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(1).max(50),
      description: z.string().min(0).max(250),
      users: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      createdBy: z.string(),
      archived: z.boolean(),
      backgroundImage: z.string().optional(),
      backgroundImageThumbnail: z.string().optional(),
      tasksOrder: z.object({
        priority: z.object({
          High: z.array(z.string()),
          Medium: z.array(z.string()),
          Low: z.array(z.string()),
        }),
        status: z.object({
          "Not Started": z.array(z.string()),
          "Up Next": z.array(z.string()),
          "In Progress": z.array(z.string()),
          Completed: z.array(z.string()),
        }),
        category: z.object({
          Household: z.array(z.string()),
          Personal: z.array(z.string()),
          Work: z.array(z.string()),
          School: z.array(z.string()),
          Other: z.array(z.string()),
        }),
      }),
      columnOrder: z.object({
        priority: z.array(z.string()).min(3),
        status: z.array(z.string()).min(3),
        category: z.array(z.string()).min(3),
      }),
    });
    try {
      projectSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      // throw new Error(JSON.stringify(errors));
      throw new ProjectEntityValidationError({
        id: errors.id?.[0],
        name: errors.name?.[0],
        description: errors.description?.[0],
        users: errors.users?.[0],
        tasks: errors.tasks?.[0],
        team: errors.team?.[0],
        createdBy: errors.createdBy?.[0],
        archived: errors.archived?.[0],
        backgroundImage: errors.backgroundImage?.[0],
        backgroundImageThumbnail: errors.backgroundImageThumbnail?.[0],
        columnOrder: errors.columnOrder?.[0],
        tasksOrder: errors.tasksOrder?.[0],
      });
    }
  }
}
