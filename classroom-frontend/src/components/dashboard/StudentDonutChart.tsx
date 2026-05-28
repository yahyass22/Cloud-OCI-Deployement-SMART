import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useStudentDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Extended color palette with actual color values for up to 12 departments
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

export const StudentDonutChart = () => {
  const { data: studentData, isLoading, error } = useStudentDepartmentDistribution();

  console.log("Student Donut Chart - Raw Data:", studentData);

  // Sort by student count descending for better visualization
  const sortedData = [...(studentData || [])].sort((a, b) => b.studentCount - a.studentCount);

  const chartData = sortedData.slice(0, 12).map((d, index) => ({
    department: d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name,
    fullName: d.name,
    students: d.studentCount,
    color: COLORS[index % COLORS.length],
  }));

  console.log("Student Donut Chart - Processed Data:", chartData);

  const total = studentData?.reduce((acc, curr) => acc + curr.studentCount, 0) ?? 0;

  // Create chart config with all departments
  const chartConfig: ChartConfig = {};
  chartData.forEach((d, index) => {
    chartConfig[d.department] = {
      label: d.fullName,
      color: d.color,
    };
  });

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base font-semibold">Student Distribution</CardTitle>
        <CardDescription className="text-xs">Students enrolled by department</CardDescription>
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
            <p className="text-sm font-medium">No student data available</p>
            <p className="text-xs mt-1">Enroll students to see distribution</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      nameKey="department"
                      hideLabel
                      formatter={(value, name, item) => (
                        <div className="flex min-w-[180px] items-center text-xs text-muted-foreground">
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full shadow-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="flex-1">{name}:</span>
                          <span className="ml-2 font-semibold text-foreground">{value} students</span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="department" />}
                  className="-translate-y-2 flex-wrap gap-3 [&>*]:basis-1/3 [&>*]:justify-center"
                />
                <Pie
                  data={chartData}
                  dataKey="students"
                  nameKey="department"
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
            <div className="flex items-center justify-center pt-2 border-t">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Enrolled</p>
                <p className="text-2xl font-bold text-foreground">{total}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
