
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "@/components/Search";

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            TodoMaster
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Search onSearch={onSearch} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
