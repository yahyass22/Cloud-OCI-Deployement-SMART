import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SectionHeader = ({ icon: Icon, title, description }: SectionHeaderProps) => (
  <div className="flex flex-col gap-1 mb-6">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
    <p className="text-sm text-muted-foreground ml-8">{description}</p>
  </div>
);
