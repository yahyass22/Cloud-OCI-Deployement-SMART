import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEnrollmentTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const EnrollmentChartVision = () => {
  const { data: trends, isLoading, error } = useEnrollmentTrends();

  const chartData = trends?.map((trend) => ({
    month: new Date(trend.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    enrollments: trend.count,
  })) ?? [];

  const total = trends?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;

  const chartConfig: ChartConfig = {
    enrollments: {
      label: "Enrollments",
      color: "#00d4ff",
    },
  };

  return (
    <Card
      className="col-span-full lg:col-span-2"
      style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-white">Enrollment Trends</CardTitle>
            <CardDescription className="text-xs text-slate-400">Monthly enrollment growth</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</p>
            <p 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #bd00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {total}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton 
              className="h-full w-full rounded-2xl" 
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-red-400">
            <p className="text-sm font-medium">Failed to load data</p>
            <p className="text-xs text-slate-500 mt-1">Please try again later</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
            <p className="text-sm font-medium">No enrollment data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex min-w-[150px] items-center text-xs" style={{ color: '#94a3b8' }}>
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full shadow-lg"
                            style={{ 
                              backgroundColor: '#00d4ff',
                              boxShadow: '0 0 10px #00d4ff80',
                            }}
                          />
                          <span className="flex-1 capitalize">{name}:</span>
                          <span className="ml-2 font-semibold text-white">{value}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  fill="url(#colorEnrollments)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
