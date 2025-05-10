
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskForm } from "@/components/TaskForm";
import { format } from "date-fns";
import { CheckCircle, Edit, Trash2, Calendar, Tag } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

  const getPriorityColorClass = () => {
    switch (task.priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      case "medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      default: return "";
    }
  };

  const formattedCreatedDate = new Date(task.createdAt).toLocaleDateString();
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <div 
      className={cn(
        "task-card transition-all duration-300 hover:shadow-lg",
        task.completed ? "bg-muted/40" : "bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className={cn(
              "font-medium text-lg",
              task.completed ? "line-through text-muted-foreground" : ""
            )}>
              {task.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className={cn(
                  "tag rounded-full px-2.5 py-1 text-xs font-medium",
                  getPriorityColorClass()
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm mt-2",
              task.completed ? "text-muted-foreground" : ""
            )}>
              {task.description}
            </p>
          )}
          
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span className={cn(
                  dueDate < new Date() && !task.completed 
                    ? "text-destructive font-medium" 
                    : ""
                )}>
                  Due: {format(dueDate, "MMM d, yyyy")}
                </span>
              </div>
            )}
            
            <div className="flex items-center">
              <span>Added: {formattedCreatedDate}</span>
            </div>
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  <Tag className="h-3 w-3 mr-1" />
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
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleUpdate}
              initialValues={task}
              submitLabel="Save Changes"
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
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
