
import { TaskCard } from "@/components/TaskCard";
import { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg mb-2">No tasks found</p>
        <p className="text-muted-foreground">Add a new task or try changing your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 task-list">
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
