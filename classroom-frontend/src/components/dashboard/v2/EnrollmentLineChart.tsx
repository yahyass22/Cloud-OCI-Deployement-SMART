import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEnrollmentTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: {
    label: "Enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function EnrollmentLineChart() {
  const { data, isLoading, error } = useEnrollmentTrends();

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
          <CardTitle>Enrollment Trends</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Total Enrollment Growth</CardTitle>
        <CardDescription>
          Cumulative student registration volume over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 10,
            }}
          >
            <defs>
              <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEnroll)"
              activeDot={{
                r: 6,
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
