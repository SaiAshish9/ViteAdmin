import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  History,
  IndianRupee,
  Settings,
  Mic,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const NavItem = ({
  href,
  icon: Icon,
  children,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: number;
}) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors cursor-pointer",
          isActive
            ? "bg-muted/50 text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-primary/10 text-xs font-medium px-2 py-0.5 rounded-full text-foreground">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      if (auth) {
        // Sign out from Firebase
        await signOut(auth);
      }
      // Clear local authentication state
      localStorage.removeItem("authenticated");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to login page
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="w-60 bg-background border-r border-border h-full flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-4 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between rounded-md p-2 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://ui-avatars.com/api/?name=Shiva+Chintaluru&background=random" 
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-foreground">Shiva Chintaluru</span>
                </div>
                <ChevronDown className="h-4 w-4 text-foreground/70" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => setLocation("/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 text-sm">
          <NavItem href="/" icon={LayoutDashboard}>
            Dashboard
          </NavItem>

          <NavItem href="/campaign-create" icon={Mic} badge={9}>
            Voice Campaigns
          </NavItem>

          <NavItem href="/call-history" icon={History}>
            Call History
          </NavItem>

          <NavItem href="/billing" icon={IndianRupee}>
            Billing
          </NavItem>

          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>
        </nav>

        {/* ProxyTalk text at the bottom */}
        <div className="p-4 mt-auto">
          <div className="text-foreground text-center">
            ProxyTalk
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
