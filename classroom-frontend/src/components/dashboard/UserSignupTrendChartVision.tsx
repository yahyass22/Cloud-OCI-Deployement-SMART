import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useUserSignupTrends } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const UserSignupTrendChartVision = () => {
  const { data: trends, isLoading, error } = useUserSignupTrends();

  const chartData = trends?.map((trend) => ({
    month: new Date(trend.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    students: trend.students,
    teachers: trend.teachers,
    total: trend.total,
  })) ?? [];

  // Neon color scheme
  const chartConfig: ChartConfig = {
    students: {
      label: "Students",
      color: "#00d4ff",
    },
    teachers: {
      label: "Teachers",
      color: "#bd00ff",
    },
    total: {
      label: "Total",
      color: "#00ff88",
    },
  };

  const totalStudents = chartData.reduce((sum, d) => sum + d.students, 0);
  const totalTeachers = chartData.reduce((sum, d) => sum + d.teachers, 0);

  return (
    <Card
      className="col-span-full"
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
            <CardTitle className="text-base font-semibold text-white">User Signup Trends</CardTitle>
            <CardDescription className="text-xs text-slate-400">Monthly signups over the past year</CardDescription>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Students</p>
              <p 
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {totalStudents}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Teachers</p>
              <p 
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #bd00ff, #ff0080)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {totalTeachers}
              </p>
            </div>
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
            <p className="text-sm font-medium">No signup data available</p>
            <p className="text-xs mt-1">User signups will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bd00ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#bd00ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
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
                              backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color,
                              boxShadow: `0 0 10px ${chartConfig[name as keyof typeof chartConfig]?.color}80`,
                            }}
                          />
                          <span className="flex-1 capitalize">{name}:</span>
                          <span className="ml-2 font-semibold text-white">{value}</span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  className="-translate-y-2 flex-wrap gap-3"
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  dot={{ fill: "#00d4ff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, filter: 'drop-shadow(0 0 8px #00d4ff)' }}
                  fill="url(#colorStudents)"
                />
                <Line
                  type="monotone"
                  dataKey="teachers"
                  stroke="#bd00ff"
                  strokeWidth={3}
                  dot={{ fill: "#bd00ff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, filter: 'drop-shadow(0 0 8px #bd00ff)' }}
                  fill="url(#colorTeachers)"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#00ff88"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  fill="url(#colorTotal)"
                />
              </LineChart>
            </ChartContainer>
            
            {/* Neon Legend */}
            <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-slate-700/50">
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                }}
              >
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ 
                    backgroundColor: '#00d4ff',
                    boxShadow: '0 0 10px #00d4ff',
                  }}
                />
                <span className="text-xs font-medium text-cyan-400">Students</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(189, 0, 255, 0.1)',
                  border: '1px solid rgba(189, 0, 255, 0.3)',
                }}
              >
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ 
                    backgroundColor: '#bd00ff',
                    boxShadow: '0 0 10px #bd00ff',
                  }}
                />
                <span className="text-xs font-medium text-purple-400">Teachers</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                }}
              >
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ 
                    backgroundColor: '#00ff88',
                    boxShadow: '0 0 10px #00ff88',
                  }}
                />
                <span className="text-xs font-medium text-green-400">Total (dashed)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
