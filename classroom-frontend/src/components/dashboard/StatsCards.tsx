import { GraduationCap, BookOpen, Users, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";

const statCards = [
  {
    title: "Total Students",
    icon: GraduationCap,
    dataKey: "totalStudents" as keyof DashboardStats,
    description: "Active students enrolled",
  },
  {
    title: "Total Classes",
    icon: BookOpen,
    dataKey: "totalClasses" as keyof DashboardStats,
    description: "Active classes running",
  },
  {
    title: "Total Teachers",
    icon: Users,
    dataKey: "totalTeachers" as keyof DashboardStats,
    description: "Faculty members",
  },
  {
    title: "Total Enrollments",
    icon: ClipboardList,
    dataKey: "totalEnrollments" as keyof DashboardStats,
    description: "Course enrollments",
  },
];

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  totalSubjects: number;
  totalEnrollments: number;
}

export const StatsCards = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">
                Error Loading
              </CardTitle>
              <stat.icon className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive">Failed to load data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const value = stats ? stats[stat.dataKey] : 0;

        return (
          <Card key={stat.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{value?.toLocaleString() ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
