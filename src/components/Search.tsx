
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export function Search({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[200px] lg:w-[300px] bg-secondary/50"
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 top-0"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
