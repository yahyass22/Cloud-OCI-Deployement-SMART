import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import { UserCircle } from "lucide-react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role?: string;
  avatar?: string;
};

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();
  const isGuest = user?.role === "guest" || localStorage.getItem('guest_mode') === 'true';

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { fullName, avatar } = user;

  if (isGuest) {
    return (
      <Avatar className={cn("h-10 w-10 border-2 border-amber-200 bg-amber-50 shadow-sm transition-transform group-hover:scale-105")}>
        <AvatarFallback className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600">
          <UserCircle className="h-6 w-6 stroke-[1.5]" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("h-10", "w-10")}>
      {avatar && <AvatarImage src={avatar} alt={fullName} />}
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = "UserAvatar";
