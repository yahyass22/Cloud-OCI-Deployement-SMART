import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTopTeachers } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function TopTeachersList() {
  const { data, isLoading, error } = useTopTeachers();

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
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
        <CardTitle className="text-lg font-semibold">Top Teachers</CardTitle>
        <CardDescription>Based on student engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data?.slice(0, 5).map((teacher) => (
          <div key={teacher.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {teacher.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{teacher.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{teacher.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{teacher.studentCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Students</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
