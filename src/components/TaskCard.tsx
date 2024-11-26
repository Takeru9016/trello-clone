import { Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}

export default function TaskCard({
  task,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onClick,
}: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="mb-2 touch-none"
    >
      <Card
        className="cursor-pointer shadow-sm transition-colors hover:bg-gray-50/90 hover:shadow"
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{task.title}</p>
            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {task.description}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
