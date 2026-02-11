import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-lg flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          </Link>
        </Button>
      </div>
    </header>
  );
}
