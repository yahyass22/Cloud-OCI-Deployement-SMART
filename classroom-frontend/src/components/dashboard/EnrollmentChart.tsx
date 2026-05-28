import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEnrollmentTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const EnrollmentChart = () => {
  const { data: trends, isLoading, error } = useEnrollmentTrends();

  const chartData = trends?.map((trend) => ({
    month: new Date(trend.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    enrollments: trend.count,
  })) ?? [];

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
        <CardDescription>Monthly enrollment statistics for the past year</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-destructive">
            <p>Failed to load enrollment data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No enrollment data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
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
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke="var(--color-enrollments)"
                fill="var(--color-enrollments)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
