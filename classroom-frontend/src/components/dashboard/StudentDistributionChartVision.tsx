import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { useStudentDepartmentDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Neon color palette for departments
const COLORS = [
  "#00d4ff", // Neon Blue
  "#bd00ff", // Neon Purple
  "#00ff88", // Neon Green
  "#ff0080", // Neon Pink
  "#00ffff", // Neon Cyan
  "#ff8800", // Neon Orange
  "#ffdd00", // Neon Yellow
  "#ff0040", // Neon Red
  "#9d00ff", // Neon Violet
  "#00cc88", // Neon Mint
  "#ff6600", // Neon Dark Orange
  "#0088ff", // Neon Sky Blue
];

export const StudentDistributionChartVision = () => {
  const { data: studentData, isLoading, error } = useStudentDepartmentDistribution();

  // Sort by student count descending and take top 10
  const sortedData = [...(studentData || [])]
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 10);

  const chartData = sortedData.map((d, index) => ({
    department: d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name,
    fullName: d.name,
    code: d.code,
    students: d.studentCount,
    color: COLORS[index % COLORS.length],
  }));

  const total = studentData?.reduce((acc, curr) => acc + curr.studentCount, 0) ?? 0;

  const chartConfig: ChartConfig = {
    students: {
      label: "Students",
      color: "#00d4ff",
    },
  };

  return (
    <Card
      className="col-span-full lg:col-span-1"
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
            <CardTitle className="text-base font-semibold text-white">Student Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-400">Top 10 departments by enrollment</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</p>
            <p 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00ffff)',
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
            <p className="text-sm font-medium">No student data available</p>
            <p className="text-xs mt-1">Enroll students to see distribution</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="h-[280px] w-full"
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                barSize={24}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="department"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={140}
                  tick={{ fontSize: 11, fill: '#e2e8f0', fontWeight: 500 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex min-w-[180px] items-center text-xs" style={{ color: '#94a3b8' }}>
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full shadow-lg"
                            style={{ backgroundColor: chartData[0]?.color || COLORS[0] }}
                          />
                          <span className="flex-1">Students:</span>
                          <span className="ml-2 font-semibold text-white">{value}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="students"
                  radius={[6, 6, 6, 6]}
                  barSize={24}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{
                        filter: `drop-shadow(0 0 8px ${entry.color}60)`,
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            
            {/* Neon Legend Badges */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700/50">
              {chartData.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${item.color}30`,
                  }}
                  title={item.fullName}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                  <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>{item.code}</span>
                  <span className="text-xs font-bold text-white">{item.students}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
