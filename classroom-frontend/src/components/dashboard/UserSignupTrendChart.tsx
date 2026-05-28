import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useUserSignupTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const UserSignupTrendChart = () => {
  const { data: trends, isLoading, error } = useUserSignupTrends();

  console.log("User Signup Trends - Raw Data:", trends);

  const chartData = trends?.map((trend) => ({
    month: new Date(trend.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    students: trend.students,
    teachers: trend.teachers,
    total: trend.total,
  })) ?? [];

  console.log("User Signup Trends - Processed Data:", chartData);

  // Use actual color values instead of CSS variables
  const chartConfig: ChartConfig = {
    students: {
      label: "Students",
      color: "#2563eb", // Blue
    },
    teachers: {
      label: "Teachers",
      color: "#f97316", // Orange
    },
    total: {
      label: "Total",
      color: "#16a34a", // Green
    },
  };

  // Calculate totals for header
  const totalStudents = chartData.reduce((sum, d) => sum + d.students, 0);
  const totalTeachers = chartData.reduce((sum, d) => sum + d.teachers, 0);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">User Signup Trends</CardTitle>
            <CardDescription className="text-xs">Monthly signups over the past year</CardDescription>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Students</p>
              <p className="text-lg font-bold text-blue-600">{totalStudents}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Teachers</p>
              <p className="text-lg font-bold text-orange-600">{totalTeachers}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-destructive">
            <p className="text-sm font-medium">Failed to load data</p>
            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <p className="text-sm font-medium">No signup data available</p>
            <p className="text-xs mt-1">User signups will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex min-w-[150px] items-center text-xs text-muted-foreground">
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color }}
                          />
                          <span className="flex-1 capitalize">{name}:</span>
                          <span className="ml-2 font-semibold text-foreground">{value}</span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  className="-translate-y-2 flex-wrap gap-3"
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke={chartConfig.students.color}
                  strokeWidth={3}
                  dot={{ fill: chartConfig.students.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="teachers"
                  stroke={chartConfig.teachers.color}
                  strokeWidth={3}
                  dot={{ fill: chartConfig.teachers.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={chartConfig.total.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            
            {/* Legend with totals */}
            <div className="flex flex-wrap justify-center gap-3 pt-3 border-t">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50">
                <div className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="text-xs font-medium text-blue-700">Students</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-50">
                <div className="h-3 w-3 rounded-full bg-orange-600" />
                <span className="text-xs font-medium text-orange-700">Teachers</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50">
                <div className="h-3 w-3 rounded-full bg-green-600" />
                <span className="text-xs font-medium text-green-700">Total (dashed)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
