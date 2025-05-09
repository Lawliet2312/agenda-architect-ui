import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskPriority } from "@/types/task";
import { Header } from "@/components/Header";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskFilters } from "@/components/TaskFilters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : demoTasks;
  });
  
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "all" as "all" | "pending" | "completed",
    priority: "all" as "all" | TaskPriority,
    sort: "newest" as "newest" | "oldest" | "dueDate" | "priority",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...taskData,
    };
    
    setTasks([newTask, ...tasks]);
    setIsAddDialogOpen(false);
    toast({
      title: "Task added",
      description: "Your new task has been created",
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
      variant: "destructive",
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
    
    toast({
      title: completed ? "Task completed" : "Task reopened",
      description: completed 
        ? "Your task has been marked as completed" 
        : "Your task has been reopened",
      variant: "default",
    });
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground mt-1">
              Manage your tasks and stay organized
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="p-6">
          <TaskFilters
            filter={filter}
            onFilterChange={handleFilterChange}
          />
          
          <TaskList
            tasks={filteredTasks}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        </Card>
      </main>
    </div>
  );
};

// Demo tasks for initial state
const demoTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the draft proposal for the new client project, including timeline and budget.",
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    priority: "high",
    tags: ["work", "client", "proposal"]
  },
  {
    id: "2",
    title: "Buy groceries for the week",
    description: "Milk, eggs, bread, fruits, and vegetables",
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    priority: "medium",
    tags: ["personal", "shopping"]
  },
  {
    id: "3",
    title: "Schedule dentist appointment",
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    priority: "low",
    tags: ["health", "personal"]
  },
  {
    id: "4",
    title: "Review team performance reports",
    description: "Analyze Q1 performance data and prepare insights for the management meeting",
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: "high",
    tags: ["work", "management", "reports"]
  },
];

export default Index;
