import { List, Task } from "@/types/task";

export function createTask(title: string = "New Task"): Task {
  return {
    id: crypto.randomUUID(),
    title,
    description: "",
    dueDate: undefined,
  };
}

export function updateTaskInList(
  lists: List[],
  listId: string,
  updatedTask: Task
): List[] {
  return lists.map((list) =>
    list.id === listId
      ? {
          ...list,
          tasks: list.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }
      : list
  );
}
