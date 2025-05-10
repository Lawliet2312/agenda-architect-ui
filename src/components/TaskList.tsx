
import { TaskCard } from "@/components/TaskCard";
import { Task } from "@/types/task";
import { ClipboardX } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-secondary p-5 mb-5 animate-pulse">
          <ClipboardX className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-medium mb-3">No tasks found</h3>
        <p className="text-muted-foreground max-w-md">
          Add a new task or try changing your filters to see your tasks here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 task-list mt-8">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
