"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ListCard, AddList, TaskDialog, ResetDialog } from "@/components";
import { List, Task } from "@/types/task";
import { handleListDrop, handleTaskDrop } from "@/utils/dragAndDrop";
import { loadFromStorage, saveToStorage, updateTaskInList } from "@/lib";

interface DraggedItem {
  type: "task" | "list";
  listId?: string;
  taskId?: string;
}

export default function TrelloBoard() {
  const [lists, setLists] = useState<List[]>(loadFromStorage);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    saveToStorage(lists);
  }, [lists]);

  const addList = () => {
    if (!newListTitle.trim()) return;

    setLists([
      ...lists,
      {
        id: crypto.randomUUID(),
        title: newListTitle,
        tasks: [],
      },
    ]);
    setNewListTitle("");
    setIsAddingList(false);
  };

  const updateListTitle = (listId: string, newTitle: string) => {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list,
      ),
    );
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  const addTask = (listId: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: "New Task",
      description: "",
      dueDate: "",
    };

    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list,
      ),
    );
    setSelectedTask(newTask);
    setSelectedListId(listId);
    setIsEditingTask(true);
  };

  const updateTask = (updatedTask: Task) => {
    if (!selectedListId) return;
    setLists(updateTaskInList(lists, selectedListId, updatedTask));
  };

  const deleteTask = (listId: string, taskId: string) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
          : list,
      ),
    );
    setIsEditingTask(false);
    setSelectedTask(null);
  };

  const handleDragStart = (
    e: React.DragEvent,
    type: "task" | "list",
    taskId?: string,
  ) => {
    const listId = (e.currentTarget.closest("[data-list-id]") as HTMLElement)
      ?.dataset.listId;
    setDraggedItem({ type, listId, taskId });
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetListId = (
      e.currentTarget.closest("[data-list-id]") as HTMLElement
    )?.dataset.listId;
    if (!targetListId) return;

    if (
      draggedItem.type === "task" &&
      draggedItem.listId &&
      draggedItem.taskId
    ) {
      setLists(
        handleTaskDrop(
          lists,
          draggedItem.taskId,
          draggedItem.listId,
          targetListId,
        ),
      );
    } else if (draggedItem.type === "list" && draggedItem.listId) {
      setLists(handleListDrop(lists, draggedItem.listId, targetListId));
    }
  };

  const resetBoard = () => {
    setLists([]);
    localStorage.removeItem("trelloLists");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:p-4">
        <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
          Trello Clone
        </h1>
        <Button
          variant="destructive"
          size="sm"
          className="md:size-md"
          onClick={() => setIsResetDialogOpen(true)}
        >
          Reset Board
        </Button>
        <ResetDialog
          isOpen={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
          onConfirm={() => {
            resetBoard();
            setIsResetDialogOpen(false);
          }}
        />
      </header>

      <main className="flex-1 overflow-hidden p-2 md:p-4">
        <div className="flex min-h-[calc(100vh-10rem)] items-start gap-3 overflow-x-auto pb-4 md:gap-4">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDeleteList={() => deleteList(list.id)}
              onAddTask={() => addTask(list.id)}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setSelectedListId(list.id);
                setIsEditingTask(true);
              }}
              onUpdateListTitle={(newTitle) =>
                updateListTitle(list.id, newTitle)
              }
            />
          ))}

          <AddList
            isAdding={isAddingList}
            title={newListTitle}
            onTitleChange={setNewListTitle}
            onAdd={addList}
            onCancel={() => {
              setIsAddingList(false);
              setNewListTitle("");
            }}
            onStartAdding={() => setIsAddingList(true)}
          />
        </div>
      </main>

      <TaskDialog
        task={selectedTask}
        isOpen={isEditingTask}
        onOpenChange={setIsEditingTask}
        onUpdate={updateTask}
        onDelete={() =>
          selectedListId &&
          selectedTask &&
          deleteTask(selectedListId, selectedTask.id)
        }
      />

      <footer className="mt-auto border-t bg-white p-4 text-center text-sm text-gray-500">
        Trello Clone - Built with Next.js & Shadcn/ui
      </footer>
    </div>
  );
}
