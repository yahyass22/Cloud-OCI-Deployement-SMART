import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useUserSignupTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  total: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
  teachers: {
    label: "Teachers",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function OverviewChart() {
  const { data, isLoading, error } = useUserSignupTrends();

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Failed to load signup trends</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-col items-start space-y-2 pb-6">
        <div className="grid gap-1">
          <CardTitle className="text-xl font-semibold">User Growth</CardTitle>
          <CardDescription>
            Showing total user signups for the last few months.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-students)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-students)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillTeachers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-teachers)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-teachers)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="students"
              type="natural"
              fill="url(#fillStudents)"
              stroke="var(--color-students)"
              strokeWidth={2}
              stackId="a"
            />
             <Area
              dataKey="teachers"
              type="natural"
              fill="url(#fillTeachers)"
              stroke="var(--color-teachers)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
