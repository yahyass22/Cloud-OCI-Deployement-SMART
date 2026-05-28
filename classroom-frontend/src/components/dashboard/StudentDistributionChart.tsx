import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { useStudentDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Color palette for departments
const COLORS = [
  "#2563eb", // Blue
  "#f97316", // Orange
  "#eab308", // Yellow
  "#16a34a", // Green
  "#dc2626", // Red
  "#7c3aed", // Purple
  "#0891b2", // Cyan
  "#db2777", // Pink
  "#4f46e5", // Indigo
  "#059669", // Emerald
  "#d97706", // Amber
  "#be185d", // Rose
];

export const StudentDistributionChart = () => {
  const { data: studentData, isLoading, error } = useStudentDepartmentDistribution();

  console.log("Student Distribution Chart - Raw Data:", studentData);

  // Sort by student count descending and take top 10
  const sortedData = [...(studentData || [])]
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 10);

  const chartData = sortedData.map((d, index) => ({
    department: d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name,
    fullName: d.name,
    code: d.code,
    students: d.studentCount,
    color: COLORS[index % COLORS.length],
  }));

  console.log("Student Distribution Chart - Processed Data:", chartData);

  const total = studentData?.reduce((acc, curr) => acc + curr.studentCount, 0) ?? 0;

  // Create chart config
  const chartConfig: ChartConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Student Distribution</CardTitle>
            <CardDescription className="text-xs">Top 10 departments by enrollment</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-primary">{total}</p>
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
            <p className="text-sm font-medium">No student data available</p>
            <p className="text-xs mt-1">Enroll students to see distribution</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="h-[280px] w-full"
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                barSize={24}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="department"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={140}
                  tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', fontWeight: 500 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex min-w-[180px] items-center text-xs text-muted-foreground">
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: chartData[0]?.color || COLORS[0] }}
                          />
                          <span className="flex-1">Students:</span>
                          <span className="ml-2 font-semibold text-foreground">{value}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="students"
                  radius={[4, 4, 4, 4]}
                  barSize={24}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              {chartData.map((item, index) => (
                <div
                  key={item.code}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                  title={item.fullName}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">{item.code}</span>
                  <span className="text-xs font-semibold text-foreground">{item.students}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
