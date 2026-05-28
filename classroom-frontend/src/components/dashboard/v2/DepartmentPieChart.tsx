import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
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
import { useStudentDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, code }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.04) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[9px] font-bold pointer-events-none"
    >
      {code}
    </text>
  );
};

export function DepartmentPieChart() {
  const { data, isLoading, error } = useStudentDepartmentDistribution();

  const totalStudents = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.studentCount, 0) ?? 0;
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data.map((item, index) => ({
      name: item.name,
      code: item.code,
      value: item.studentCount,
      fill: `var(--chart-${(index % 12) + 1})`,
    }));
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data?.forEach((item, index) => {
      config[item.code] = {
        label: item.name,
        color: `var(--chart-${(index % 12) + 1})`,
      };
    });
    return config;
  }, [data]);

  if (isLoading) {
    return (
      <Card className="flex flex-col border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <Skeleton className="mx-auto aspect-square h-[250px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">Department Distribution</CardTitle>
        <CardDescription>Student count per department</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="code"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              stroke="var(--background)"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Students
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
