export type ProjectModelType = {
  _id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  tasksOrder: TasksOrder;
  columnOrder: ColumnOrder;
};
export type ColumnOrder = Record<string, string[]>;
export type TasksOrder = Record<string, Record<string, string[]>>;
