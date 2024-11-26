import { List } from "@/types/task";

export function handleListDrop(
  lists: List[],
  draggedListId: string,
  targetListId: string
): List[] {
  const listsCopy = [...lists];
  const draggedList = listsCopy.find((l) => l.id === draggedListId);
  const targetIndex = listsCopy.findIndex((l) => l.id === targetListId);

  if (!draggedList) return lists;

  listsCopy.splice(
    listsCopy.findIndex((l) => l.id === draggedListId),
    1
  );
  listsCopy.splice(targetIndex, 0, draggedList);
  return listsCopy;
}

export function handleTaskDrop(
  lists: List[],
  draggedTaskId: string,
  sourceListId: string,
  targetListId: string
): List[] {
  const sourceList = lists.find((l) => l.id === sourceListId);
  const task = sourceList?.tasks.find((t) => t.id === draggedTaskId);

  if (!task) return lists;

  return lists.map((list) => {
    if (list.id === sourceListId) {
      return {
        ...list,
        tasks: list.tasks.filter((t) => t.id !== draggedTaskId),
      };
    }
    if (list.id === targetListId) {
      return {
        ...list,
        tasks: [...list.tasks, task],
      };
    }
    return list;
  });
}
