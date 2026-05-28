import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useClassStatusDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Fixed status colors - using actual color values
const STATUS_COLORS: Record<string, string> = {
  active: "#2563eb",      // Blue
  inactive: "#f97316",    // Orange
  archived: "#eab308",    // Yellow
};

export const ClassStatusPieChart = () => {
  const { data: statusData, isLoading, error } = useClassStatusDistribution();

  console.log("Class Status Pie Chart - Raw Data:", statusData);

  const chartData = statusData?.map((d) => ({
    status: d.status,
    count: d.count,
    label: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    color: STATUS_COLORS[d.status] || "hsl(var(--chart-1))",
  })) ?? [];

  console.log("Class Status Pie Chart - Processed Data:", chartData);

  const total = statusData?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;

  // Create chart config for each status
  const chartConfig: ChartConfig = {};
  statusData?.forEach((d) => {
    chartConfig[d.status] = {
      label: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      color: STATUS_COLORS[d.status] || "#2563eb",
    };
  });

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Class Status</CardTitle>
            <CardDescription className="text-xs">Distribution by status</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-primary">{total}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[280px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-destructive">
            <p className="text-sm font-medium">Failed to load data</p>
            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
            <p className="text-sm font-medium">No class data available</p>
            <p className="text-xs mt-1">Add classes to see distribution</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[240px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      nameKey="status"
                      hideLabel
                      formatter={(value, name, item) => (
                        <div className="flex min-w-[150px] items-center text-xs text-muted-foreground">
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full shadow-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="flex-1">{name}:</span>
                          <span className="ml-2 font-semibold text-foreground">{value} classes</span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerK={55}
                  outerK={100}
                  strokeWidth={8}
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Status Legend */}
            <div className="flex flex-wrap justify-center gap-2 pt-3 border-t">
              {chartData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-muted-foreground capitalize">{item.status}</span>
                  <span className="text-xs font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
