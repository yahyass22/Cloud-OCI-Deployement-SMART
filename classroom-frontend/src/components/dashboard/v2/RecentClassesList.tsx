import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRecentClasses } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecentClassesList() {
  const { data, isLoading, error } = useRecentClasses();

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) return null;

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Classes</CardTitle>
        <CardDescription>Recently added or updated classes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data?.slice(0, 5).map((cls) => (
          <div key={cls.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-primary font-bold text-xs">
                {cls.subject.code}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium leading-none truncate max-w-[150px]">{cls.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{cls.teacher.name}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] px-1.5 h-4 font-bold uppercase",
                  cls.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" :
                  cls.status === "archived" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" :
                  "bg-muted text-muted-foreground border-border"
                )}
              >
                {cls.status}
              </Badge>
              <p className="text-[10px] text-muted-foreground">{cls.enrolledStudents} enrolled</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
