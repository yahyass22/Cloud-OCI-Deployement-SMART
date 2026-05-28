import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScheduleHeatmap } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
const DAYS = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
];

const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
};

const getIntensityStyle = (count: number, maxCount: number) => {
  if (count === 0) return { backgroundColor: "transparent" };
  // Minimum 15% opacity for visibility, up to 100%
  const intensity = 0.15 + (count / maxCount) * 0.85;
  return {
    backgroundColor: `hsl(var(--primary) / ${intensity})`,
  };
};

export const ClassScheduleHeatmap = () => {
  const { data: heatmapData, isLoading, error } = useScheduleHeatmap();

  // Create a map of day-hour to count
  const scheduleMap = new Map<string, number>();
  heatmapData?.forEach((d) => {
    const key = `${d.day}-${d.hour}`;
    scheduleMap.set(key, d.count);
  });

  const maxCount = Math.max(...(heatmapData?.map((d) => d.count) || [0]), 1);

  return (
    <Card className="col-span-full border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">Class Schedule Heatmap</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Peak class times and room utilization throughout the week
            </CardDescription>
          </div>
          {!isLoading && !error && heatmapData && heatmapData.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              <span>Less Busy</span>
              <div className="flex gap-0.5">
                {[0.2, 0.4, 0.6, 0.8, 1].map((lvl) => (
                  <div
                    key={lvl}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: `hsl(var(--primary) / ${lvl})` }}
                  />
                ))}
              </div>
              <span>Peak</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2 py-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-2">
            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-sm font-medium">Failed to load schedule data</p>
          </div>
        ) : !heatmapData || heatmapData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[240px] text-center border-2 border-dashed rounded-xl bg-muted/5">
            <p className="text-sm text-muted-foreground max-w-[200px]">
              No schedule data found. Add class schedules to see the heatmap.
            </p>
          </div>
        ) : (
          <div className="relative mt-4">
            <div className="overflow-x-auto pb-4 scrollbar-none">
              <div className="min-w-[700px]">
                {/* Header: Hours */}
                <div className="flex mb-3">
                  <div className="w-14 flex-shrink-0" />
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="flex-1 text-[10px] font-semibold text-muted-foreground text-center"
                    >
                      {hour === 8 || hour === 12 || hour === 16 ? formatHour(hour) : hour > 12 ? hour - 12 : hour}
                    </div>
                  ))}
                </div>

                {/* Grid: Days */}
                <TooltipProvider delayDuration={0}>
                  {DAYS.map((day) => (
                    <div key={day.full} className="flex mb-1.5 items-center group/row">
                      <div className="w-14 flex-shrink-0 text-xs font-bold text-muted-foreground transition-colors group-hover/row:text-foreground">
                        {day.short}
                      </div>
                      <div className="flex flex-1 gap-1">
                        {HOURS.map((hour) => {
                          const key = `${day.full}-${hour}`;
                          const count = scheduleMap.get(key) || 0;
                          const intensityStyle = getIntensityStyle(count, maxCount);

                          return (
                            <Tooltip key={key}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "flex-1 h-9 rounded-[4px] border border-transparent transition-all duration-200 cursor-default",
                                    count === 0 ? "bg-muted/10" : "hover:scale-[1.05] hover:shadow-md hover:z-10 hover:border-primary/20",
                                    "relative"
                                  )}
                                  style={intensityStyle}
                                >
                                  {count > (maxCount * 0.7) && count > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <span className="text-[10px] font-bold text-primary-foreground/90">
                                        {count}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="flex flex-col gap-0.5 px-3 py-2">
                                <span className="font-bold">{day.full}</span>
                                <span className="text-muted-foreground">
                                  {formatHour(hour)}: <span className="text-primary-foreground font-semibold">{count} {count === 1 ? 'Class' : 'Classes'}</span>
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            </div>
            
            {/* Legend for smaller screens or bottom placement if preferred */}
            <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-muted-foreground md:hidden">
               <span>Less</span>
               <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-muted/20 to-primary" />
               <span>Peak</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

