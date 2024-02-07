export type TaskDto = {
  id?: string;
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate?: number;
  startDate: number;
  complete: boolean;
  priority: string;
  status: string;
  label: string;
};
