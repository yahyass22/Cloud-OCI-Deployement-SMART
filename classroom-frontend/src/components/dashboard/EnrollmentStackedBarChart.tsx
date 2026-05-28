import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEnrollmentByDepartment } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Color palette for departments
const departmentColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const EnrollmentStackedBarChart = () => {
  const { data: enrollmentData, isLoading, error } = useEnrollmentByDepartment();

  // Group data by month and create stacked bars per department
  const groupedData = new Map<string, { month: string; [key: string]: string | number }>();
  
  enrollmentData?.forEach((d) => {
    const existing = groupedData.get(d.month);
    if (existing) {
      existing[d.department] = (existing[d.department] as number || 0) + d.count;
    } else {
      groupedData.set(d.month, {
        month: d.month,
        [d.department]: d.count,
      });
    }
  });

  // Get unique departments for chart config
  const departments = Array.from(
    new Set(enrollmentData?.map((d) => d.department) || [])
  ).slice(0, 6);

  const chartData = Array.from(groupedData.values())
    .slice(-12)
    .map((d) => {
      const formatted: any = {
        month: new Date(d.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      };
      departments.forEach((dept) => {
        formatted[dept] = (d[dept] as number) || 0;
      });
      return formatted;
    });

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Enrollment Trends by Department</CardTitle>
        <CardDescription>Monthly enrollment distribution across departments</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-destructive">
            <p>Failed to load data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No enrollment data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent />}
                className="-translate-y-2 flex-wrap gap-2"
              />
              {departments.map((dept, index) => (
                <Bar
                  key={dept}
                  dataKey={dept}
                  fill={departmentColors[index % departmentColors.length]}
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
