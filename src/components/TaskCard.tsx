
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskForm } from "@/components/TaskForm";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onToggleComplete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleToggleComplete = () => {
    onToggleComplete(task.id, !task.completed);
  };
  
  const handleUpdate = (updatedFields: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    onUpdate({
      ...task,
      ...updatedFields,
    });
    setIsEditDialogOpen(false);
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "";
    }
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2">
              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Due: {format(new Date(task.dueDate), "MMM d")}
                </span>
              )}
              
              <span className={`tag ${getPriorityClass()}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? "text-muted-foreground" : ""}`}>
              {task.description}
            </p>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleUpdate}
              initialValues={task}
              submitLabel="Save Changes"
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(task.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
