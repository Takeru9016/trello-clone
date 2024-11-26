"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/task";

interface TaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
}

export default function TaskDialog({
  task,
  isOpen,
  onOpenChange,
  onUpdate,
  onDelete,
}: TaskDialogProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(true);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        description: task.description || "",
        dueDate: task.dueDate || "",
      });
      setIsNewTask(
        task.title === "New Task" && !task.description && !task.dueDate,
      );
    }
  }, [task]);

  if (!editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[425px] sm:w-full">
        <DialogHeader>
          <DialogTitle>{isNewTask ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              placeholder="Add a more detailed description"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) =>
                setEditedTask({ ...editedTask, dueDate: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-between">
          <div
            className={`flex ${!isNewTask ? "justify-between" : "justify-end"} w-full gap-2`}
          >
            {!isNewTask && (
              <Button variant="destructive" onClick={onDelete}>
                Delete Task
              </Button>
            )}
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onUpdate(editedTask);
                  onOpenChange(false);
                }}
              >
                {isNewTask ? "Create Task" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
