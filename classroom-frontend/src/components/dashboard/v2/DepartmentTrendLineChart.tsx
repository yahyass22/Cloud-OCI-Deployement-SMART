import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEnrollmentByDepartment } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DepartmentTrendLineChart() {
  const { data, isLoading, error } = useEnrollmentByDepartment();

  const formattedData = React.useMemo(() => {
    if (!data) return [];

    const monthMap = new Map();
    data.forEach((item) => {
      if (!monthMap.has(item.month)) {
        monthMap.set(item.month, { month: item.month });
      }
      const entry = monthMap.get(item.month);
      entry[item.department] = item.count;
    });

    return Array.from(monthMap.values()).sort((a, b) =>
        new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [data]);

  // Generate all 12 months of academic year (Sep - Aug)
  const academicMonths = React.useMemo(() => {
    if (formattedData.length === 0) return [];
    
    const months = [];
    const startDate = new Date(formattedData[0]?.month || new Date());
    startDate.setMonth(8); // September (0-indexed: 8 = September)
    startDate.setDate(1);
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      months.push(monthDate.toISOString().slice(0, 7)); // YYYY-MM format
    }
    return months;
  }, [formattedData]);

  const departments = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((item) => item.department)));
  }, [data]);

  const months = React.useMemo(() => {
    return academicMonths.length > 0 ? academicMonths : formattedData.map((d) => d.month);
  }, [formattedData, academicMonths]);

  const { minCount, maxCount } = React.useMemo(() => {
    if (!data || data.length === 0) return { minCount: 0, maxCount: 10 };
    const counts = data.map((d) => d.count);
    return {
      minCount: Math.min(...counts),
      maxCount: Math.max(...counts),
    };
  }, [data]);

  const getColorIntensity = (count: number | undefined) => {
    if (count === undefined) return "bg-muted/10";
    const range = maxCount - minCount || 1;
    const intensity = (count - minCount) / range;
    
    if (intensity >= 0.8) return "bg-emerald-500";
    if (intensity >= 0.6) return "bg-emerald-400";
    if (intensity >= 0.4) return "bg-amber-400";
    if (intensity >= 0.2) return "bg-orange-400";
    return "bg-rose-400";
  };

  const getTextColor = (count: number | undefined) => {
    if (count === undefined) return "text-white/50";
    return "text-white";
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Department Breakdown</CardTitle>
            <CardDescription>
              Enrollment heatmap across departments by month
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Low</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-rose-400" />
              <div className="w-3 h-3 rounded-sm bg-orange-400" />
              <div className="w-3 h-3 rounded-sm bg-amber-400" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            </div>
            <span>High</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {/* Header Row - Months */}
          <div className="grid gap-0 mb-3" style={{ gridTemplateColumns: `120px repeat(${months.length}, 1fr)` }}>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-end pb-1">Department</div>
            {months.map((month) => {
              const date = new Date(month + "-01");
              return (
                <div key={month} className="text-center text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
              );
            })}
          </div>

          {/* Department Rows */}
          <div className="space-y-0">
            {departments.map((dept) => (
              <div
                key={dept}
                className="grid gap-0"
                style={{ gridTemplateColumns: `120px repeat(${months.length}, 1fr)` }}
              >
                {/* Department Name */}
                <div className="flex items-center pr-2">
                  <span className="text-xs font-medium text-foreground truncate" title={dept}>
                    {dept}
                  </span>
                </div>

                {/* Month Cells - Responsive Width */}
                {months.map((month) => {
                  const rowData = formattedData.find((d) => d.month === month);
                  const count = rowData?.[dept] as number | undefined;
                  
                  return (
                    <div
                      key={`${dept}-${month}`}
                      className="h-10"
                      title={`${dept}: ${count ?? 'No data'}`}
                    >
                      <div
                        className={cn(
                          "w-full h-full flex items-center justify-center transition-colors",
                          count !== undefined ? getColorIntensity(count) : "bg-muted/20"
                        )}
                      >
                        <span className={cn(
                          "text-[11px] font-bold",
                          getTextColor(count)
                        )}>
                          {count ?? "·"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Enrollments</p>
            <p className="text-2xl font-bold text-foreground">
              {data?.reduce((sum, d) => sum + d.count, 0).toLocaleString() ?? 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg per Department</p>
            <p className="text-2xl font-bold text-foreground">
              {data && departments.length > 0
                ? Math.round(data.reduce((sum, d) => sum + d.count, 0) / departments.length)
                : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Peak Month</p>
            <p className="text-lg font-bold text-foreground">
              {months.length > 0
                ? months.reduce((max, month) => {
                    const total = departments.reduce((sum, dept) => {
                      const rowData = formattedData.find((d) => d.month === month);
                      return sum + ((rowData?.[dept] as number) || 0);
                    }, 0);
                    return total > max.total ? { month, total } : max;
                  }, { month: "", total: 0 }).month
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
