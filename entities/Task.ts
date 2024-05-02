import { ZodError, z } from "zod";

type ValidatedFields =
  | "id"
  | "name"
  | "description"
  | "project"
  | "assignees"
  | "dueDate"
  | "startDate"
  | "archived"
  | "priority"
  | "category"
  | "status";

export class TaskEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an task entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export type OrderInLists = Record<string, [string, number]>;

export class TaskEntity {
  private id?: string;
  private name: string;
  private description: string;
  private project: string;
  private assignees: string[];
  private dueDate: Date;
  private startDate: Date;
  private archived: boolean;
  private priority: string;
  private category: string;
  private status: string;

  constructor({
    id,
    name = "New Task",
    description = "Task Description",
    project,
    assignees = [],
    dueDate = new Date(new Date().setDate(new Date().getDate() + 7)),
    startDate = new Date(),
    archived = false,
    category = "Personal",
    priority = "Medium",
    status = "To Do",
  }: {
    id?: string;
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate: Date;
    startDate: Date;
    category: string;
    archived: boolean;
    priority: string;
    status: string;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.project = project;
    this.assignees = assignees;
    this.category = category;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.archived = archived;
    this.priority = priority;
    this.status = status;
    this.validate();
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getProject() {
    return this.project;
  }

  getAssignees() {
    return this.assignees;
  }

  getDueDate() {
    return this.dueDate;
  }

  getStartDate() {
    return this.startDate;
  }

  getArchived() {
    return this.archived;
  }

  getCategory() {
    return this.category;
  }

  getPriority() {
    return this.priority;
  }

  getStatus() {
    return this.status;
  }

  getId() {
    return this.id;
  }

  updateName(name: string) {
    this.name = name;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  updateProject(project: string) {
    this.project = project;
  }

  addAssignees(assignees: string[]) {
    assignees.forEach((assignee) => {
      if (this.assignees.indexOf(assignee) === -1) {
        this.assignees.push(assignee);
      }
    });
  }

  removeAssignees(assignees: string[]) {
    assignees.forEach((assignee) => {
      this.assignees = this.assignees.filter((a) => a !== assignee);
    });
  }

  updateDueDate(dueDate: Date) {
    this.dueDate = dueDate;
  }

  updateStartDate(startDate: Date) {
    this.startDate = startDate;
  }

  updateArchived(archived: boolean) {
    this.archived = archived;
  }

  updatePriority(priority: string) {
    this.priority = priority;
  }

  updateStatus(status: string) {
    this.status = status;
  }

  updateCategory(category: string) {
    this.category = category;
  }

  removeAssignee(assignee: string) {
    this.assignees = this.assignees.filter((a) => a !== assignee);
  }

  private validate() {
    const taskSchema = z.object({
      name: z.string().min(1).max(50),
      description: z.string().min(0).max(500),
      project: z.string(),
      assignees: z.array(z.string()).min(0),
      dueDate: z.date().optional(),
      startDate: z.date(),
      archived: z.boolean(),
      priority: z.string(),
      status: z.string(),
      category: z.string(),
    });
    try {
      taskSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new TaskEntityValidationError({
        id: errors.id?.[0],
        name: errors.name?.[0],
        description: errors.description?.[0],
        project: errors.project?.[0],
        assignees: errors.assignees?.[0],
        dueDate: errors.dueDate?.[0],
        startDate: errors.startDate?.[0],
        archived: errors.archived?.[0],
        priority: errors.priority?.[0],
        status: errors.status?.[0],
        category: errors.category?.[0],
      });
    }
  }
}
