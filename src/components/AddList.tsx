import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddListProps {
  isAdding: boolean;
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  onStartAdding: () => void;
}

export default function AddList({
  isAdding,
  title,
  onTitleChange,
  onAdd,
  onCancel,
  onStartAdding,
}: AddListProps) {
  if (isAdding) {
    return (
      <div className="w-72 shrink-0">
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Enter list title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button onClick={onAdd}>Add List</Button>
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-72 h-12 shrink-0"
      onClick={onStartAdding}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add List
    </Button>
  );
}
