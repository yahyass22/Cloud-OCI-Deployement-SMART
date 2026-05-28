import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
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
import { useRecentClasses } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function ClassSaturationHeatmap() {
  const { data, isLoading, error } = useRecentClasses();

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data.map((cls) => {
      const saturation = Math.round((cls.enrolledStudents / cls.capacity) * 100);
      return {
        name: cls.name,
        code: cls.subject.code,
        inviteCode: cls.inviteCode || "N/A",
        saturation,
        enrolled: cls.enrolledStudents,
        capacity: cls.capacity,
      };
    }).sort((a, b) => b.saturation - a.saturation);
  }, [data]);

  const getBarColor = (saturation: number) => {
    if (saturation > 90) return "oklch(0.6368 0.2078 25.3313)"; // Critical Red
    if (saturation >= 70) return "oklch(0.7 0.18 80)"; // Warning Amber
    return "var(--primary)"; // Brand Primary
  };

  const chartConfig = {
    saturation: {
      label: "Saturation %",
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Class Saturation</CardTitle>
        <CardDescription>Operational health based on enrollment vs capacity</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 40, right: 40 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              dataKey="code"
              type="category"
              axisLine={false}
              tickLine={false}
              width={60}
              className="text-[10px] font-bold"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const item = payload[0]?.payload;
                    return `${item?.name} (${item?.inviteCode})`;
                  }}
                  formatter={(value) => `${value}% Saturation`}
                />
              }
            />
            <Bar dataKey="saturation" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.saturation)} />
              ))}
              <LabelList 
                dataKey="saturation" 
                position="right" 
                formatter={(val: number) => `${val}%`}
                className="fill-foreground text-[10px] font-medium"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
