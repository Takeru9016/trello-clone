export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
}
