"use client";

import * as React from "react";
import { useScheduleHeatmap } from "@/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, BookOpen } from "lucide-react";

interface ScheduleItem {
  classId: number;
  className: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_ABBREVS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const DEPT_COLORS: Record<string, string> = {
  CS: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  MATH: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  PHYS: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  CHEM: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  BIO: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  ENG: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  HIST: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  ECON: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  PSY: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
  DEFAULT: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
};

const getDeptColor = (code: string) => {
  const prefix = code.replace(/[0-9]/g, "");
  return DEPT_COLORS[prefix] || DEPT_COLORS.DEFAULT;
};

export function ScheduleTable() {
  const { data, isLoading } = useScheduleHeatmap();
  const [selectedDay, setSelectedDay] = React.useState<string>("all");

  const scheduleData = React.useMemo(
    () => (Array.isArray(data) ? (data as ScheduleItem[]) : []),
    [data]
  );

  const filteredData = React.useMemo(() => {
    if (selectedDay === "all") return scheduleData;
    return scheduleData.filter((item) => item.day === selectedDay);
  }, [scheduleData, selectedDay]);

  const groupedByTime = React.useMemo(() => {
    const groups: Record<string, ScheduleItem[]> = {};
    filteredData.forEach((item) => {
      const key = `${item.startTime}-${item.endTime}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.entries(groups).sort(
      (a, b) => a[0].split("-")[0].localeCompare(b[0].split("-")[0])
    );
  }, [filteredData]);

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {filteredData.length} sessions
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedDay("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedDay === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {DAYS.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedDay === day
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {DAY_ABBREVS[idx]}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y">
        {groupedByTime.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No classes scheduled
            </p>
          </div>
        ) : (
          groupedByTime.map(([timeRange, items]) => {
            const [start, end] = timeRange.split("-");
            return (
              <div key={timeRange} className="flex hover:bg-muted/30">
                <div className="flex w-32 flex-shrink-0 items-center justify-center border-r p-4 bg-muted/20">
                  <div className="flex flex-col items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">{start}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {end}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-wrap gap-3 p-4">
                  {items.map((item) => {
                    const colorClass = getDeptColor(item.subjectCode);
                    return (
                      <div
                        key={item.classId}
                        className={`flex flex-1 min-w-[280px] flex-col gap-2 rounded-lg border p-3 ${colorClass}`}
                      >
                        <div className="flex items-start justify-between">
                          <Badge
                            variant="outline"
                            className="h-5 text-[10px] font-bold"
                          >
                            {item.subjectCode}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {item.className}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.subjectName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-current/10">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {item.teacherName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className="font-medium">{item.day}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
