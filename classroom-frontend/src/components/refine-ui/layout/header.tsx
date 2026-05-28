import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { ThemeSwitcher } from "@/components/refine-ui/theme/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  useActiveAuthProvider,
  useLogout,
  useGetIdentity,
} from "@refinedev/core";
import { LogOutIcon, GraduationCap, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom Logo Component
function Logo() {
  return (
    <img
      src="/logo.png"
      alt="Classroom Logo"
      className="h-8 w-auto object-contain"
    />
  );
}

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  const { data: identity } = useGetIdentity();
  const isGuest = identity?.role === "guest" || localStorage.getItem('guest_mode') === 'true';

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-end",
        "z-40"
      )}
    >
      <ThemeSwitcher />
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { data: identity } = useGetIdentity();
  const isGuest =
    identity?.role === "guest" || localStorage.getItem("guest_mode") === "true";

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-12",
        "shrink-0",
        "items-center",
        "gap-2",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40"
      )}
    >
      <SidebarTrigger
        className={cn("text-muted-foreground", "rotate-180", "ml-1", {
          "opacity-0": open,
          "opacity-100": !open || isMobile,
          "pointer-events-auto": !open || isMobile,
          "pointer-events-none": open && !isMobile,
        })}
      />

      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-2",
          "transition-discrete",
          "duration-200",
          {
            "pl-3": !open,
            "pl-5": open,
          }
        )}
      >
        <div className="relative">
          <Logo />
          {isGuest && (
            <div className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 ring-1 ring-sidebar">
              <GraduationCap className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
        {isGuest && open && (
          <Badge
            variant="secondary"
            className={cn(
              "h-5 px-2 text-[10px] uppercase font-bold bg-amber-100 text-amber-700 border-amber-200 transition-opacity duration-200",
              {
                "opacity-0": !open,
                "opacity-100": open,
              }
            )}
          >
            Guest
          </Badge>
        )}
      </div>

      <ThemeToggle className={cn("h-8", "w-8")} />
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: identity } = useGetIdentity();
  const authProvider = useActiveAuthProvider();

  const isGuest = identity?.role === "guest" || localStorage.getItem('guest_mode') === 'true';

  if (!authProvider?.getIdentity) {
    return null;
  }

  const handleLogout = () => {
    if (isGuest) {
      localStorage.removeItem('guest_mode');
      window.location.href = '/login';
    } else {
      logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-12 flex items-center gap-2 px-2 hover:bg-accent/50 transition-all rounded-full group",
            isGuest && "pr-4 bg-gradient-to-r from-amber-500/5 to-amber-500/10 hover:from-amber-500/10 hover:to-amber-500/20 border border-amber-200/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]"
          )}
        >
          <div className="relative">
            <UserAvatar />
            {isGuest && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 ring-2 ring-sidebar shadow-sm animate-in zoom-in duration-300">
                <GraduationCap className="h-2.5 w-2.5 text-white" />
              </div>
            )}
            {isGuest && (
              <div className="absolute inset-0 rounded-full ring-2 ring-amber-500/20 animate-pulse" />
            )}
          </div>
          {isGuest && (
            <div className="flex flex-col items-start gap-0">
              <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-tight leading-none">Session</span>
              <span className="text-xs font-bold text-amber-700 leading-tight">Guest</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleLogout}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : isGuest ? "Exit Guest Mode" : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
