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
    gradient: "from-[#00d4ff] to-[#00ffff]",
    glowColor: "rgba(0, 212, 255, 0.4)",
  },
  {
    title: "Total Classes",
    icon: BookOpen,
    dataKey: "totalClasses" as keyof DashboardStats,
    description: "Active classes running",
    gradient: "from-[#bd00ff] to-[#ff0080]",
    glowColor: "rgba(189, 0, 255, 0.4)",
  },
  {
    title: "Total Teachers",
    icon: Users,
    dataKey: "totalTeachers" as keyof DashboardStats,
    description: "Faculty members",
    gradient: "from-[#00ff88] to-[#00ffff]",
    glowColor: "rgba(0, 255, 136, 0.4)",
  },
  {
    title: "Total Enrollments",
    icon: ClipboardList,
    dataKey: "totalEnrollments" as keyof DashboardStats,
    description: "Course enrollments",
    gradient: "from-[#ff8800] to-[#ff0040]",
    glowColor: "rgba(255, 136, 0, 0.4)",
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const value = stats ? stats[stat.dataKey] : 0;

        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden group transition-all duration-300 hover:transform hover:-translate-y-1"
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            {/* Gradient Glow Effect on Hover */}
            <div
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl"
              style={{
                background: `linear-gradient(135deg, ${stat.gradient})`,
              }}
            />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
              
              {/* Gradient Icon Container */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${stat.gradient})`,
                  boxShadow: `0 4px 20px ${stat.glowColor}`,
                }}
              >
                <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <Skeleton 
                  className="h-10 w-24" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px'
                  }} 
                />
              ) : error ? (
                <p className="text-sm text-red-400">Error loading</p>
              ) : (
                <div className="space-y-1">
                  <p 
                    className="text-3xl font-bold tracking-tight"
                    style={{
                      background: `linear-gradient(135deg, ${stat.gradient})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {value?.toLocaleString() ?? 0}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
