
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TaskPriority } from "@/types/task";

interface TaskFiltersProps {
  filter: {
    status: "all" | "pending" | "completed";
    priority: "all" | TaskPriority;
    sort: "newest" | "oldest" | "dueDate" | "priority";
  };
  onFilterChange: (filter: any) => void;
}

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <div className="flex">
          <Button
            size="sm"
            variant={filter.status === "all" ? "default" : "outline"}
            onClick={() => onFilterChange({ ...filter, status: "all" })}
            className="rounded-r-none"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter.status === "pending" ? "default" : "outline"}
            onClick={() => onFilterChange({ ...filter, status: "pending" })}
            className="rounded-none border-x-0"
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter.status === "completed" ? "default" : "outline"}
            onClick={() => onFilterChange({ ...filter, status: "completed" })}
            className="rounded-l-none"
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Select
          value={filter.priority}
          onValueChange={(value) => onFilterChange({ ...filter, priority: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium">Sort by:</span>
        <Select
          value={filter.sort}
          onValueChange={(value) => onFilterChange({ ...filter, sort: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
