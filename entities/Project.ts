import { ZodError, z } from "zod";
export type ListsNextAvailable = Record<string, Record<string, number>>;
export type TasksOrder = Record<string, Record<string, string[]>>;
export type ColumnOrder = Record<string, string[]>;
export class ProjectEntity {
  private id?: string;
  private name: string;
  private description: string;
  private users: string[];
  // private members: string[];
  private tasks: string[];
  private team: string;
  private createdBy: string;
  private archived: boolean;
  private columnOrder: ColumnOrder;
  // private listsNextAvailable: ListsNextAvailable;
  private tasksOrder: TasksOrder;
  constructor({
    id,
    name,
    description,
    users,
    // members,
    tasks,
    team,
    createdBy,
    archived = false,
    // listsNextAvailable,
    columnOrder,
    tasksOrder,
  }: {
    id?: string;
    name: string;
    description: string;
    users: string[];
    // admins: string[];
    tasks: string[];
    team: string;
    createdBy: string;
    archived: boolean;
    // listsNextAvailable: ListsNextAvailable;
    columnOrder: ColumnOrder;
    tasksOrder: TasksOrder;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.users = users;
    // this.admins = admins;
    this.tasks = tasks;
    this.team = team;
    this.createdBy = createdBy;
    this.archived = archived;
    // this.listsNextAvailable = listsNextAvailable;
    this.columnOrder = columnOrder;
    this.tasksOrder = tasksOrder;
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
  // getListsNextAvailable() {
  //   return this.listsNextAvailable;
  // }
  getColumnOrder() {
    return this.columnOrder;
  }
  getTasksOrder() {
    return this.tasksOrder;
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

  updateArchived(archived: boolean) {
    this.archived = archived;
  }
  addTask(project: string) {
    this.tasks.push(project);
  }
  updateName(name: string) {
    this.name = name;
  }
  updateDescription(description: string) {
    this.description = description;
  }
  // updateListsNextAvailable(listsNextAvailable: ListsNextAvailable) {
  //   this.listsNextAvailable = listsNextAvailable;
  // }
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
      name: z.string().min(3).max(30),
      description: z.string().min(3).max(50),
      users: z.array(z.string()).optional(),
      // admins: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      createdBy: z.string(),
      archived: z.boolean(),
      // listsNextAvailable: z.object({
      //   priority: z.object({
      //     High: z.number(),
      //     Medium: z.number(),
      //     Low: z.number(),
      //   }),
      //   status: z.object({
      //     "Not Started": z.number(),
      //     "Up Next": z.number(),
      //     "In Progress": z.number(),
      //     Completed: z.number(),
      //   }),
      //   category: z.object({
      //     Household: z.number(),
      //     Personal: z.number(),
      //     Work: z.number(),
      //     School: z.number(),
      //     Other: z.number(),
      //   }),
      // }),
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
      throw new Error(JSON.stringify(errors));
    }
  }
}
