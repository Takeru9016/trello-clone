"use client";

import { useRef, useState } from "react";
import { X, Plus, Pencil } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface ListCardProps {
  list: List;
  onDragStart: (
    e: React.DragEvent,
    type: "task" | "list",
    taskId?: string,
  ) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDeleteList: () => void;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onUpdateListTitle: (title: string) => void;
}

export default function ListCard({
  list,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDeleteList,
  onAddTask,
  onTaskClick,
  onUpdateListTitle,
}: ListCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="w-[280px] shrink-0 touch-none md:w-72"
      draggable
      onDragStart={(e) => onDragStart(e, "list")}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-list-id={list.id}
    >
      <Card className="border bg-white/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
          {isEditingTitle ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newTitle.trim()) {
                  onUpdateListTitle(newTitle);
                  setIsEditingTitle(false);
                }
              }}
              className="mr-2 flex-1"
            >
              <Input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => {
                  if (newTitle.trim()) {
                    onUpdateListTitle(newTitle);
                    setIsEditingTitle(false);
                  } else {
                    setNewTitle(list.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="h-7 text-sm"
              />
            </form>
          ) : (
            <div
              className="flex flex-1 cursor-pointer items-center gap-2"
              onClick={() => setIsEditingTitle(true)}
            >
              <h3 className="text-sm font-medium">{list.title}</h3>
              <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteList}
            className="h-6 w-6 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-12rem)] overflow-y-auto p-2">
          {list.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={(e) => onDragStart(e, "task", task.id)}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={() => onTaskClick(task)}
            />
          ))}
          <Button
            variant="ghost"
            className="mt-2 h-auto w-full py-3 text-sm hover:bg-gray-100 hover:text-black"
            onClick={onAddTask}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
