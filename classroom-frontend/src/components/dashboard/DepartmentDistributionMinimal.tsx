import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useStudentDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export const DepartmentDistributionMinimal = () => {
  const { data: studentData, isLoading, error } = useStudentDepartmentDistribution();

  const chartData = studentData?.map((d, index) => ({
    code: d.code,
    name: d.name,
    students: d.studentCount,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  })) ?? [];

  const chartConfig: ChartConfig = {
    students: {
      label: "Students",
    },
  };

  const totalStudents = studentData?.reduce((sum, d) => sum + d.studentCount, 0) ?? 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Department Distribution</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Student enrollment by department</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-destructive">Failed to load data</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">No department data available</div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="code"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  width={60}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const item = chartData.find((d) => d.code === value);
                        return item?.name ?? value;
                      }}
                    />
                  }
                />
                <Bar dataKey="students" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
              {chartData.map((item, index) => {
                const percentage = totalStudents > 0 ? ((item.students / totalStudents) * 100).toFixed(1) : 0;
                return (
                  <div key={item.code} className="flex items-center gap-2 overflow-hidden">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: `var(${CHART_COLORS[index % CHART_COLORS.length]})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground truncate block" title={item.name}>
                        {item.code}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.students} ({percentage}%)
                      </span>
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
