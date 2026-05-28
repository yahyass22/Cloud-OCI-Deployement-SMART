import { StatsCards } from "@/components/dashboard/v2/StatsCards";
import { EnrollmentLineChart } from "@/components/dashboard/v2/EnrollmentLineChart";
import { DepartmentTrendLineChart } from "@/components/dashboard/v2/DepartmentTrendLineChart";
import { ClassStatusDonut } from "@/components/dashboard/v2/ClassStatusDonut";
import { DepartmentPieChart } from "@/components/dashboard/v2/DepartmentPieChart";
import { TopTeachersList } from "@/components/dashboard/v2/TopTeachersList";
import { RecentClassesList } from "@/components/dashboard/v2/RecentClassesList";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, LayoutDashboard, RefreshCcw, BarChart3, Activity, Users2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/section-header";
import { StaleIndicator } from "@/components/StaleIndicator";
import { dashboardApi } from "@/services/dashboard";

const Dashboard = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userRole = session?.user?.role;
  const isGuest = userRole === "guest" || localStorage.getItem('guest_mode') === 'true';

  // Get query state for stale indicator
  const { dataUpdatedAt, isStale, isFetching, refetch } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
    staleTime: 2 * 60 * 1000,
    enabled: false, // Don't fetch, just get state from cache
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-12 p-6 md:p-10 animate-in fade-in duration-700">

      {/* --- GLOBAL HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 p-6 rounded-2xl border border-border/50 backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <LayoutDashboard className="h-6 w-6" />
             </div>
             <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Command Center</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">v2.4.0 Live</Badge>
                  {isGuest && (
                    <Badge variant="outline" className="text-[10px] uppercase font-bold border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400">
                      Guest Access
                    </Badge>
                  )}
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
             <div className="hidden lg:flex items-center gap-2 text-muted-foreground mr-4 pr-4 border-r border-border/50">
                <CalendarDays className="h-4 w-4" />
                <p className="text-sm font-semibold">{currentDate}</p>
             </div>
             {/* Stale Indicator */}
             <StaleIndicator
                compact
                lastUpdatedAt={dataUpdatedAt > 0 ? new Date(dataUpdatedAt) : null}
                isStale={isStale}
                isFetching={isFetching}
                onRefresh={() => refetch?.()}
             />
             <Button variant="outline" size="sm" onClick={handleRefresh} className="h-10 gap-2 shadow-sm">
                <RefreshCcw className="h-4 w-4" />
                Sync Data
             </Button>
             <Button size="sm" className="h-10 px-6 font-bold shadow-md shadow-primary/10">
                Generate Report
             </Button>
        </div>
      </div>

      {/* --- MODULE 1: KEY PERFORMANCE INDICATORS --- */}
      <section>
        <StatsCards />
      </section>

      <Separator className="opacity-50" />

      {/* --- MODULE 2: GROWTH & COMPOSITION --- */}
      <section className="space-y-12">
        <SectionHeader
          icon={BarChart3}
          title="Enrollment & Academic Insights"
          description="Long-term growth trends and departmental student distribution analytics."
        />

        {/* Row 1: Overall System Growth (Full Width) */}
        <div className="w-full">
          <EnrollmentLineChart />
        </div>

        {/* Row 2: Distribution Breakdowns (Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ClassStatusDonut />
            <DepartmentPieChart />
        </div>

        {/* Row 3: Departmental Breakdown (Full Width) */}
        <div className="w-full">
            <DepartmentTrendLineChart />
        </div>
      </section>

      <Separator className="opacity-50" />

      {/* --- MODULE 4: DIRECTORY & ACTIVITY --- */}
      <section>
        <SectionHeader
          icon={ListChecks}
          title="Recent Activity & Leadership"
          description="Tracking the latest class updates and top-performing faculty members."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <RecentClassesList />
          </div>
          <div className="lg:col-span-1">
              <TopTeachersList />
          </div>
        </div>
      </section>

      {/* --- FOOTER STATUS BAR --- */}
      <footer className="mt-8 p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">U{i}</div>
              ))}
            </div>
            <StaleIndicator
                compact
                lastUpdatedAt={dataUpdatedAt > 0 ? new Date(dataUpdatedAt) : null}
                isStale={isStale}
                isFetching={isFetching}
             />
         </div>
         <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API: Stable
            </span>
            <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL: Connected
            </span>
            <Badge variant="outline" className="text-[9px] py-0 h-4 px-1.5 opacity-50">Enterprise v2.4</Badge>
         </div>
      </footer>
    </div>
  );
};

export default Dashboard;
