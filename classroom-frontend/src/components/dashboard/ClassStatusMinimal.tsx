import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useClassStatusDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "var(--chart-1)" },
  inactive: { label: "Inactive", color: "var(--chart-4)" },
  archived: { label: "Archived", color: "var(--chart-6)" },
};

export const ClassStatusMinimal = () => {
  const { data: statusData, isLoading, error } = useClassStatusDistribution();

  const chartData = statusData?.map((d) => ({
    status: d.status,
    count: d.count,
    fill: STATUS_CONFIG[d.status]?.color || "var(--muted-foreground)",
  })) ?? [];

  const totalClasses = statusData?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  const chartConfig: ChartConfig = {
    count: {
      label: "Classes",
    },
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Class Status</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Distribution of classes</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalClasses.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Classes</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : error ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-destructive">Failed to load data</div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">No class data available</div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Status breakdown */}
            <div className="space-y-2">
              {statusData?.map((item) => {
                const config = STATUS_CONFIG[item.status];
                const percentage = totalClasses > 0 ? ((item.count / totalClasses) * 100).toFixed(0) : 0;
                return (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: config?.color }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {config?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold">{item.count}</span>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
