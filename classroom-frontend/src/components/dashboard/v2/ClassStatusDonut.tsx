import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
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
import { useClassStatusDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  active: {
    label: "Active",
    color: "var(--chart-2)",
  },
  inactive: {
    label: "Inactive",
    color: "var(--chart-4)",
  },
  archived: {
    label: "Archived",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ClassStatusDonut() {
  const { data, isLoading, error } = useClassStatusDistribution();

  const totalClasses = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
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
          <CardTitle>Class Status</CardTitle>
          <CardDescription>Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = data?.map((item) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  })) ?? [];

  return (
    <Card className="flex flex-col border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">Class Status</CardTitle>
        <CardDescription>Current state of all classes</CardDescription>
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
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          {totalClasses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Classes
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
