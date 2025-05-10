import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskPriority } from "@/types/task";
import { Header } from "@/components/Header";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskFilters } from "@/components/TaskFilters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert snake_case database fields to camelCase for our Task interface
const mapDatabaseTaskToTask = (dbTask: any): Task => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || undefined,
    completed: dbTask.completed,
    createdAt: dbTask.created_at,
    dueDate: dbTask.due_date || undefined,
    priority: dbTask.priority as TaskPriority,
    tags: dbTask.tags || [],
  };
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "all" as "all" | "pending" | "completed",
    priority: "all" as "all" | TaskPriority,
    sort: "newest" as "newest" | "oldest" | "dueDate" | "priority",
  });
  
  const { toast } = useToast();

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Map the database response to our Task interface
          const mappedTasks = data.map(mapDatabaseTaskToTask);
          setTasks(mappedTasks);
          console.log("Tasks fetched:", mappedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error fetching tasks",
          description: "Failed to load your tasks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter, searchQuery]);

  // Function to apply all filters and search
  const applyFilters = () => {
    let result = [...tasks];
    
    // Apply status filter
    if (filter.status !== "all") {
      const isCompleted = filter.status === "completed";
      result = result.filter(task => task.completed === isCompleted);
    }
    
    // Apply priority filter
    if (filter.priority !== "all") {
      result = result.filter(task => task.priority === filter.priority);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    result = sortTasks(result);
    
    setFilteredTasks(result);
  };

  const sortTasks = (tasksToSort: Task[]) => {
    switch (filter.sort) {
      case "newest":
        return [...tasksToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return [...tasksToSort].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "dueDate":
        return [...tasksToSort].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case "priority": {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return [...tasksToSort].sort(
          (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
        );
      }
      default:
        return tasksToSort;
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    try {
      // Convert our Task interface object to the database format
      const dbTask = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        due_date: taskData.dueDate,
        tags: taskData.tags || [],
        completed: false,
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(dbTask)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        // Map the database response to our Task interface
        const mappedTask = mapDatabaseTaskToTask(data);
        setTasks([mappedTask, ...tasks]);
        setIsAddDialogOpen(false);
        toast({
          title: "Task added",
          description: "Your new task has been created",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: "Failed to add your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      // Convert our Task object to the database format
      const dbTask = {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        due_date: updatedTask.dueDate,
        priority: updatedTask.priority,
        tags: updatedTask.tags || [],
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(dbTask)
        .eq('id', updatedTask.id);
      
      if (error) {
        throw error;
      }
      
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: "Failed to update your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTasks(tasks.filter(task => task.id !== id));
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: "Failed to delete your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed } : task
      ));
      
      toast({
        title: completed ? "Task completed" : "Task reopened",
        description: completed 
          ? "Your task has been marked as completed" 
          : "Your task has been reopened",
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast({
        title: "Error updating task",
        description: "Failed to update your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardList className="h-7 w-7" />
              Task Manager
            </h2>
            <p className="text-muted-foreground mt-1">
              Organize your tasks and boost your productivity
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300">
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="p-6 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <TaskFilters
            filter={filter}
            onFilterChange={handleFilterChange}
          />
          
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading your tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
