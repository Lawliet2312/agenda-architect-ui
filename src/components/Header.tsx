
import { Search } from "@/components/Search";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/UserProfile";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">Tasks</span>
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-xs">
            <Search onSearch={onSearch} />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
