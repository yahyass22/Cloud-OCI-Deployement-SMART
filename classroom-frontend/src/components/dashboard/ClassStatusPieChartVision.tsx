import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useClassStatusDistribution } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Neon status colors
const STATUS_COLORS: Record<string, string> = {
  active: "#00d4ff",      // Neon Blue
  inactive: "#bd00ff",    // Neon Purple
  archived: "#ff0080",    // Neon Pink
};

export const ClassStatusPieChartVision = () => {
  const { data: statusData, isLoading, error } = useClassStatusDistribution();

  const chartData = statusData?.map((d) => ({
    status: d.status,
    count: d.count,
    label: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    color: STATUS_COLORS[d.status] || "#00d4ff",
  })) ?? [];

  const total = statusData?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;

  // Create chart config
  const chartConfig: ChartConfig = {};
  statusData?.forEach((d) => {
    chartConfig[d.status] = {
      label: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      color: STATUS_COLORS[d.status] || "#00d4ff",
    };
  });

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
            <CardTitle className="text-base font-semibold text-white">Class Status</CardTitle>
            <CardDescription className="text-xs text-slate-400">Distribution by status</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</p>
            <p 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #00ffff)',
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
          <div className="flex items-center justify-center h-[280px]">
            <Skeleton 
              className="h-full w-full rounded-2xl" 
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-red-400">
            <p className="text-sm font-medium">Failed to load data</p>
            <p className="text-xs text-slate-500 mt-1">Please try again later</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-slate-500">
            <p className="text-sm font-medium">No class data available</p>
            <p className="text-xs mt-1">Add classes to see distribution</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[240px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      nameKey="status"
                      hideLabel
                      formatter={(value, name, item) => (
                        <div className="flex min-w-[150px] items-center text-xs" style={{ color: '#94a3b8' }}>
                          <div
                            className="mr-2 h-3 w-3 shrink-0 rounded-full shadow-lg"
                            style={{ 
                              backgroundColor: item.color,
                              boxShadow: `0 0 10px ${item.color}80`,
                            }}
                          />
                          <span className="flex-1">{name}:</span>
                          <span className="ml-2 font-semibold text-white">{value} classes</span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerK={55}
                  outerK={100}
                  strokeWidth={8}
                  stroke="rgba(30, 41, 59, 0.8)"
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
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Status Legend with Neon Badges */}
            <div className="flex flex-wrap justify-center gap-2 pt-3 border-t border-slate-700/50">
              {chartData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}`,
                    }}
                  />
                  <span className="text-xs font-medium capitalize" style={{ color: '#94a3b8' }}>{item.status}</span>
                  <span className="text-xs font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
