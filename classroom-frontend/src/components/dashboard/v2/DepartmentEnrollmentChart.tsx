import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
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
import { useEnrollmentByDepartment } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function DepartmentEnrollmentChart() {
  const { data, isLoading, error } = useEnrollmentByDepartment();

  const formattedData = React.useMemo(() => {
    if (!data) return [];
    
    const monthMap = new Map();
    data.forEach((item) => {
      if (!monthMap.has(item.month)) {
        monthMap.set(item.month, { month: item.month });
      }
      const entry = monthMap.get(item.month);
      entry[item.department] = item.count;
    });
    
    return Array.from(monthMap.values()).sort((a, b) => 
        new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [data]);

  const departments = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((item) => item.department)));
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    departments.forEach((dept, index) => {
      config[dept] = {
        label: dept,
        color: `var(--chart-${(index % 12) + 1})`,
      };
    });
    return config;
  }, [departments]);

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
          <CardTitle>Enrollments by Department</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Enrollment by Department</CardTitle>
        <CardDescription>Monthly enrollment breakdown per department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <BarChart data={formattedData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {departments.map((dept) => (
              <Bar
                key={dept}
                dataKey={dept}
                fill={`var(--color-${dept})`}
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
