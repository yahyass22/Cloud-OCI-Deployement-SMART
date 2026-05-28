import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  classes: {
    label: "Classes",
    color: "hsl(var(--chart-1))",
  },
  subjects: {
    label: "Subjects",
    color: "hsl(var(--chart-2))",
  },
  teachers: {
    label: "Teachers",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const DepartmentDistributionChart = () => {
  const { data: deptData, isLoading, error } = useDepartmentDistribution();

  const chartData = deptData?.slice(0, 8).map((d) => ({
    name: d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name,
    fullName: d.name,
    classes: d.classCount,
    subjects: d.subjectCount,
    teachers: d.teacherCount,
  })) ?? [];

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Department Distribution</CardTitle>
        <CardDescription>Classes, subjects, and teachers by department</CardDescription>
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
            <p>No department data available</p>
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
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="classes" fill="var(--color-classes)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="subjects" fill="var(--color-subjects)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="teachers" fill="var(--color-teachers)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
