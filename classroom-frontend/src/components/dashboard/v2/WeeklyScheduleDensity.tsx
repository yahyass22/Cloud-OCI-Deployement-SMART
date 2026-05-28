import * as React from "react";
import { useScheduleHeatmap } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Search, Clock, User, RotateCcw, Activity } from "lucide-react";

// ... (constants)
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const START_HOUR = 8;
const END_HOUR = 17;
const SLOT_BASE_HEIGHT_COMFORTABLE = 80;
const SLOT_BASE_HEIGHT_COMPACT = 42;
const SLOT_GRID_COLUMNS = 4;
const SLOT_ROW_HEIGHT = 30;
const SLOT_ROW_GAP = 3;
const SLOT_VERTICAL_PADDING = 6;

// Comfortable mode specific constants
const COMFORTABLE_SLOT_HEIGHT = 120;
const COMFORTABLE_SLOT_GAP = 12;
const COMFORTABLE_VERTICAL_PADDING = 16;

interface RoutineItem {
  classId: number;
  className: string;
  subjectName: string;
  subjectCode: string;
  departmentCode: string | null;
  departmentName: string | null;
  teacherName: string;
  teacherImage: string | null;
  day: string;
  startTime: string;
  endTime: string;
}

interface DepartmentGroup {
  departmentCode: string;
  departmentName: string;
  items: RoutineItem[];
  codes: string[];
}

const DEPT_MAP: Record<string, string> = {
  "COMPUTER SCIENCE": "bg-sky-500 text-white border-sky-600 shadow-sky-500/20",
  "MATHEMATICS": "bg-indigo-500 text-white border-indigo-600 shadow-indigo-500/20",
  "PHYSICS": "bg-violet-500 text-white border-violet-600 shadow-violet-500/20",
  "CHEMISTRY": "bg-pink-500 text-white border-pink-600 shadow-pink-500/20",
  "BIOLOGY": "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20",
  "ENGLISH": "bg-rose-500 text-white border-rose-600 shadow-rose-500/20",
  "HISTORY": "bg-orange-500 text-white border-orange-600 shadow-orange-500/20",
  "GEOGRAPHY": "bg-teal-500 text-white border-teal-600 shadow-teal-500/20",
  "ECONOMICS": "bg-amber-500 text-amber-950 border-amber-600 shadow-amber-500/20",
  "BUSINESS": "bg-blue-600 text-white border-blue-700 shadow-blue-600/20",
  "ENGINEERING": "bg-slate-700 text-white border-slate-800 shadow-slate-700/20",
  "PSYCHOLOGY": "bg-purple-400 text-white border-purple-500 shadow-purple-400/20",
  "SOCIOLOGY": "bg-fuchsia-500 text-white border-fuchsia-600 shadow-fuchsia-500/20",
  "POLITICAL SCIENCE": "bg-red-500 text-white border-red-600 shadow-red-500/20",
  "PHILOSOPHY": "bg-lime-500 text-lime-950 border-lime-600 shadow-lime-500/20",
  "EDUCATION": "bg-cyan-500 text-cyan-950 border-cyan-600 shadow-cyan-500/20",
  "FINE ARTS": "bg-red-400 text-white border-red-500 shadow-red-400/20",
  "MUSIC": "bg-rose-400 text-white border-rose-500 shadow-rose-400/20",
  "PHYSICAL EDUCATION": "bg-yellow-500 text-yellow-950 border-yellow-600 shadow-yellow-500/20",
  "LAW": "bg-slate-900 text-white border-black shadow-slate-900/20",
};

const DEPT_CONSOLIDATION: Record<string, string> = {
  "ENGINEERING": "ENGINEERING", "ENGR": "ENGINEERING", "CIVIL ENGINEERING": "ENGINEERING", "CE": "ENGINEERING", "ELECTRICAL ENGINEERING": "ENGINEERING", "EE": "ENGINEERING", "MECHANICAL ENGINEERING": "ENGINEERING", "ME": "ENGINEERING",
  "BUSINESS": "BUSINESS", "BUS": "BUSINESS", "BUSINESS ADMINISTRATION": "BUSINESS", "BUSINESS ADMIN": "BUSINESS",
  "COMPUTER SCIENCE": "COMPUTER SCIENCE", "CS": "COMPUTER SCIENCE", "MATHEMATICS": "MATHEMATICS", "MATH": "MATHEMATICS",
  "PHYSICS": "PHYSICS", "PHYS": "PHYSICS", "CHEMISTRY": "CHEMISTRY", "CHEM": "CHEMISTRY", "BIOLOGY": "BIOLOGY", "BIO": "BIOLOGY",
  "ENGLISH": "ENGLISH", "ENG": "ENGLISH", "HISTORY": "HISTORY", "HIST": "HISTORY", "GEOGRAPHY": "GEOGRAPHY", "GEOG": "GEOGRAPHY", "ECONOMICS": "ECONOMICS", "ECON": "ECONOMICS", "PSYCHOLOGY": "PSYCHOLOGY", "PSY": "PSYCHOLOGY", "SOCIOLOGY": "SOCIOLOGY", "SOC": "SOCIOLOGY", "POLITICAL SCIENCE": "POLITICAL SCIENCE", "POLS": "POLITICAL SCIENCE", "PHILOSOPHY": "PHILOSOPHY", "PHIL": "PHILOSOPHY", "EDUCATION": "EDUCATION", "EDUC": "EDUCATION", "FINE ARTS": "FINE ARTS", "ART": "FINE ARTS", "MUSIC": "MUSIC", "MUS": "MUSIC", "PHYSICAL EDUCATION": "PHYSICAL EDUCATION", "PE": "PHYSICAL EDUCATION",
};

const getCanonicalDept = (code: string | null | undefined) => {
  if (!code) return "OTHER";
  const upper = code.toUpperCase().trim();
  return DEPT_CONSOLIDATION[upper] || upper;
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getWeekStartMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const fmtDayNumber = (date: Date) => date.getDate().toString();
const fmtMonthShort = (date: Date) => date.toLocaleDateString("en-US", { month: "short" });
const fmtWeekday = (date: Date) => date.toLocaleDateString("en-US", { weekday: "long" });

const getWeekdayIndex = (date: Date) => {
  const day = date.getDay();
  if (day === 0) return 0;
  const idx = day - 1;
  return Math.max(0, Math.min(idx, DAYS.length - 1));
};

const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const getWeekOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  return Math.ceil((date.getDate() + startDay) / 7);
};

const fmtDribbbleRange = (weekStart: Date) => {
  const weekEnd = addDays(weekStart, 4);
  const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
  const weekNum = getWeekOfMonth(weekStart);
  return {
    range: `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}`,
    label: `Week ${weekNum}, ${weekStart.getFullYear()}`
  };
};

const getTheme = (departmentName?: string | null, departmentCode?: string | null, subjectCode?: string) => {
  const canonicalName = getCanonicalDept(departmentName || departmentCode || (subjectCode || "").replace(/[0-9]/g, ""));
  const themeClasses = DEPT_MAP[canonicalName];
  if (themeClasses) return themeClasses;
  return "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-sm";
};

const getBgColorOnly = (themeClasses: string) => themeClasses.split(" ").find(c => c.startsWith("bg-")) || "bg-slate-400";
const getTextColorOnly = (themeClasses: string) => themeClasses.split(" ").find(c => c.startsWith("text-")) || "text-white";

const getCapsuleColSpan = (codesCount: number) => {
  if (codesCount <= 1) return 1;
  if (codesCount <= 2) return 2;
  if (codesCount <= 4) return 3;
  return 4;
};

const estimateRowsForCapsules = (spans: number[]) => {
  if (spans.length === 0) return 1;
  let rows = 1;
  let used = 0;
  spans.forEach((rawSpan) => {
    const span = Math.max(1, Math.min(rawSpan, SLOT_GRID_COLUMNS));
    if (used + span > SLOT_GRID_COLUMNS) {
      rows += 1;
      used = span;
      return;
    }
    used += span;
  });
  return rows;
};

const getDayTimeGroups = (items: RoutineItem[]) => {
  const groups = new Map<string, DepartmentGroup>();
  items.forEach((item) => {
    const fallbackPrefix = item.subjectCode.replace(/[0-9]/g, "").toUpperCase();
    const departmentCode = (item.departmentCode || fallbackPrefix || "DEFAULT").toUpperCase();
    const departmentName = item.departmentName || departmentCode;
    const canonicalId = getCanonicalDept(departmentCode);
    const canonicalName = getCanonicalDept(departmentName);
    if (!groups.has(canonicalId)) {
      groups.set(canonicalId, {
        departmentCode: canonicalId,
        departmentName: canonicalName,
        items: [],
        codes: [],
      });
    }
    const group = groups.get(canonicalId)!;
    group.items.push(item);
    if (!group.codes.includes(item.subjectCode)) group.codes.push(item.subjectCode);
  });
  return Array.from(groups.values()).sort((a, b) => {
    const spanDiff = getCapsuleColSpan(b.codes.length) - getCapsuleColSpan(a.codes.length);
    if (spanDiff !== 0) return spanDiff;
    return a.departmentCode.localeCompare(b.departmentCode);
  });
};

export const WeeklyScheduleDensity = React.memo(function WeeklyScheduleDensity() {
  const { data, isLoading } = useScheduleHeatmap();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focusDept, setFocusDept] = React.useState<string>("all");
  const [density, setDensity] = React.useState<"comfortable" | "compact">("compact");
  const [weekStart, setWeekStart] = React.useState<Date>(() => getWeekStartMonday(new Date()));
  const [selectedDay, setSelectedDay] = React.useState<string>(() => DAYS[getWeekdayIndex(new Date())] || DAYS[0]);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleJumpToToday = () => {
    setWeekStart(getWeekStartMonday(new Date()));
    setSelectedDay(DAYS[getWeekdayIndex(new Date())] || DAYS[0]);
  };

  const weekInfo = React.useMemo(() => fmtDribbbleRange(weekStart), [weekStart]);
  const capsuleMinHeight = density === "compact" ? 24 : 30;
  const rowGap = density === "compact" ? 4 : COMFORTABLE_SLOT_GAP;
  const slotVerticalPadding = density === "compact" ? 8 : COMFORTABLE_VERTICAL_PADDING;
  const capsuleTextClass = density === "compact" ? "text-[10px] font-black" : "text-[11px] font-black";
  const capsulePaddingClass = density === "compact" ? "px-2.5 py-1" : "px-4 py-2";

  const isComfortable = density === "comfortable";
  const comfortableCardClasses = isComfortable
    ? "rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 border border-white/10"
    : "rounded-xl";

  const getTeacherInitials = (name?: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const routineData = React.useMemo(() => {
    const source = Array.isArray(data) ? (data as RoutineItem[]) : [];
    const seen = new Set<string>();
    const unique: RoutineItem[] = [];
    source.forEach((item) => {
      const key = `${item.classId}-${item.day}-${item.startTime}-${item.endTime}-${item.subjectCode}`;
      if (seen.has(key)) return;
      const start = toMinutes(item.startTime);
      const end = toMinutes(item.endTime);
      const minStart = START_HOUR * 60;
      const maxEnd = END_HOUR * 60;
      if (start < minStart || end > maxEnd || !DAYS.includes(item.day)) return;
      seen.add(key);
      unique.push(item);
    });
    return unique;
  }, [data]);

  const allDepts = React.useMemo(() => {
    const depts = new Set<string>();
    routineData.forEach(item => {
      const code = (item.departmentCode || item.subjectCode.replace(/[0-9]/g, "")).toUpperCase();
      const canonical = getCanonicalDept(code);
      if (canonical) depts.add(canonical);
    });
    return Array.from(depts).sort();
  }, [routineData]);

  const filteredData = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return routineData;
    return routineData.filter((item) => item.className.toLowerCase().includes(q) || item.subjectCode.toLowerCase().includes(q) || item.teacherName.toLowerCase().includes(q));
  }, [routineData, searchQuery]);

  const gridMatrix = React.useMemo(() => {
    const matrix = new Map<string, Map<string, DepartmentGroup[]>>();
    const timeKeySet = new Set<string>();
    DAYS.forEach((day) => matrix.set(day, new Map<string, DepartmentGroup[]>()));
    const rawSlotsByDay = new Map<string, Map<string, RoutineItem[]>>();
    DAYS.forEach((day) => rawSlotsByDay.set(day, new Map<string, RoutineItem[]>()));
    filteredData.forEach((item) => {
      const key = `${item.startTime}-${item.endTime}`;
      timeKeySet.add(key);
      const dayMap = rawSlotsByDay.get(item.day);
      if (dayMap) {
        if (!dayMap.has(key)) dayMap.set(key, []);
        dayMap.get(key)!.push(item);
      }
    });
    const sortedTimeKeys = Array.from(timeKeySet).sort((a, b) => {
      const [aStart, aEnd] = a.split("-");
      const [bStart, bEnd] = b.split("-");
      const byStart = toMinutes(aStart) - toMinutes(bStart);
      return byStart !== 0 ? byStart : toMinutes(aEnd) - toMinutes(bEnd);
    });
    const heights: Record<string, number> = {};
    sortedTimeKeys.forEach((key) => {
      let maxRowsInRow = 1;
      DAYS.forEach((day) => {
        const items = rawSlotsByDay.get(day)?.get(key) || [];
        const groups = getDayTimeGroups(items);
        matrix.get(day)!.set(key, groups);
        const spans = groups.map((g) => getCapsuleColSpan(g.codes.length));
        maxRowsInRow = Math.max(maxRowsInRow, estimateRowsForCapsules(spans));
      });
      const effectiveRowHeight = density === "comfortable" ? COMFORTABLE_SLOT_HEIGHT : Math.max(SLOT_ROW_HEIGHT, capsuleMinHeight + 2);
      const dynamicHeight = density === "comfortable" ? maxRowsInRow * COMFORTABLE_SLOT_HEIGHT + Math.max(0, maxRowsInRow - 1) * COMFORTABLE_SLOT_GAP + COMFORTABLE_VERTICAL_PADDING : maxRowsInRow * effectiveRowHeight + Math.max(0, maxRowsInRow - 1) * rowGap + slotVerticalPadding;
      heights[key] = density === "comfortable" ? Math.max(SLOT_BASE_HEIGHT_COMFORTABLE, dynamicHeight) : Math.max(SLOT_BASE_HEIGHT_COMPACT, dynamicHeight);
    });
    return { matrix, sortedTimeKeys, heights };
  }, [filteredData, capsuleMinHeight, rowGap, slotVerticalPadding, density]);

  const { matrix: slotsByDay, sortedTimeKeys: timeKeys, heights: rowHeights } = gridMatrix;

  const livePulsePosition = React.useMemo(() => {
    if (isComfortable) return null;
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let accumulatedHeight = 64; // Header height
    for (const key of timeKeys) {
      const [start, end] = key.split("-").map(toMinutes);
      if (nowMinutes >= start && nowMinutes <= end) {
        const progress = (nowMinutes - start) / (end - start);
        return accumulatedHeight + progress * rowHeights[key];
      }
      accumulatedHeight += rowHeights[key];
    }
    return null;
  }, [currentTime, timeKeys, rowHeights, isComfortable]);

  const weekDates = React.useMemo(() => DAYS.map((_, index) => addDays(weekStart, index)), [weekStart]);
  const selectedDayIndex = Math.max(0, DAYS.indexOf(selectedDay));
  const selectedDate = weekDates[selectedDayIndex] || weekDates[0];
  const selectedDayLabel = fmtWeekday(selectedDate);
  const selectedMonth = fmtMonthShort(selectedDate);
  const isSelectedDayToday = isSameDay(selectedDate, new Date());

  const comfortableGrid = React.useMemo(() => {
    const dayItems = filteredData.filter((item) => item.day === selectedDay);
    const timeKeySet = new Set<string>();
    const rawSlots = new Map<string, RoutineItem[]>();
    dayItems.forEach((item) => {
      const key = `${item.startTime}-${item.endTime}`;
      timeKeySet.add(key);
      if (!rawSlots.has(key)) rawSlots.set(key, []);
      rawSlots.get(key)!.push(item);
    });
    const sortedTimeKeys = Array.from(timeKeySet).sort((a, b) => {
      const [aStart, aEnd] = a.split("-");
      const [bStart, bEnd] = b.split("-");
      const byStart = toMinutes(aStart) - toMinutes(bStart);
      return byStart !== 0 ? byStart : toMinutes(aEnd) - toMinutes(bEnd);
    });
    const slots = new Map<string, DepartmentGroup[]>();
    const heights: Record<string, number> = {};
    sortedTimeKeys.forEach((key) => {
      const groups = getDayTimeGroups(rawSlots.get(key) || []);
      slots.set(key, groups);
      const spans = groups.map((g) => getCapsuleColSpan(g.codes.length));
      const maxRowsInRow = estimateRowsForCapsules(spans);
      const dynamicHeight = maxRowsInRow * COMFORTABLE_SLOT_HEIGHT + Math.max(0, maxRowsInRow - 1) * COMFORTABLE_SLOT_GAP + COMFORTABLE_VERTICAL_PADDING;
      heights[key] = Math.max(SLOT_BASE_HEIGHT_COMFORTABLE, dynamicHeight);
    });
    return { slots, sortedTimeKeys, heights, total: dayItems.length };
  }, [filteredData, selectedDay]);

  if (isLoading) return <Skeleton className="h-[720px] w-full rounded-[3rem] border border-border/50" />;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-card/20 backdrop-blur-2xl rounded-[3.5rem] border border-border/60 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-700">
        
        {/* --- DYNAMIC HEADER & CONTROLS --- */}
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
            <div className="flex items-center gap-5 bg-background/40 p-2 rounded-[2rem] border border-border/80 shadow-2xl backdrop-blur-md group">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-background hover:shadow-xl transition-all active:scale-90"
                onClick={() => setWeekStart((prev) => addDays(prev, -7))}
              >
                <ChevronLeft className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </Button>

              <div className="px-6 text-center min-w-[180px]">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                   <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                   <h4 className="text-sm font-black tracking-tight text-foreground">{weekInfo.range}</h4>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">{weekInfo.label}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-background hover:shadow-xl transition-all active:scale-90"
                onClick={() => setWeekStart((prev) => addDays(prev, 7))}
              >
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleJumpToToday}
                className="h-12 rounded-2xl border-border/80 bg-background/50 hover:bg-background px-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-black/5"
              >
                <RotateCcw className="h-4 w-4 mr-2.5 text-primary" />
                Live Sync
              </Button>

              <div className="relative flex-1 sm:min-w-[340px] group">
                <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-[1.25rem] border-border/60 bg-background/40 pl-12 text-xs font-black placeholder:font-bold placeholder:text-muted-foreground/30 shadow-inner focus-visible:ring-primary/20 focus-visible:bg-background transition-all duration-300"
                  placeholder="Scan classes, faculty or codes..."
                />
              </div>

              <div className="flex bg-muted/40 p-1.5 rounded-[1.5rem] border border-border/40 shadow-inner h-12 items-center gap-1">
                <Button
                  variant={density === "compact" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 rounded-2xl text-[10px] font-black uppercase px-6 transition-all duration-500",
                    density === "compact" ? "bg-background shadow-xl text-primary scale-105" : "text-muted-foreground/60 hover:text-foreground"
                  )}
                  onClick={() => setDensity("compact")}
                >
                  Compact
                </Button>
                <Button
                  variant={density === "comfortable" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 rounded-2xl text-[10px] font-black uppercase px-6 transition-all duration-500",
                    density === "comfortable" ? "bg-background shadow-xl text-primary scale-105" : "text-muted-foreground/60 hover:text-foreground"
                  )}
                  onClick={() => setDensity("comfortable")}
                >
                  Visual
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/30">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Intelligence Filter Mode</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/80">All Systems Operational</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={focusDept === "all" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-11 rounded-2xl text-[11px] font-black uppercase px-8 transition-all duration-500 border-2 shadow-sm",
                  focusDept === "all" 
                    ? "bg-foreground text-background border-foreground shadow-2xl scale-110 z-10 -translate-y-1" 
                    : "bg-background/40 border-border/80 text-muted-foreground/60 hover:border-foreground hover:bg-background hover:text-foreground hover:-translate-y-1 active:scale-95"
                )}
                onClick={() => setFocusDept("all")}
              >
                Full Scope
              </Button>
              {allDepts.map(dept => {
                const themeClasses = getTheme(null, dept, null);
                const bgColor = getBgColorOnly(themeClasses);
                const colorBase = bgColor.replace("bg-", "");

                return (
                  <Button
                    key={dept}
                    variant={focusDept === dept ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-11 rounded-2xl text-[11px] font-black uppercase px-5 transition-all duration-500 border-2",
                      focusDept === dept 
                        ? cn(themeClasses, "border-transparent shadow-2xl scale-110 z-10 -translate-y-1.5 ring-4 ring-primary/10") 
                        : cn(
                            "bg-background/30 border-border/50 text-muted-foreground/50",
                            `hover:border-${colorBase} hover:bg-${colorBase}/5 hover:text-foreground hover:-translate-y-1 hover:shadow-xl active:scale-95`
                          )
                    )}
                    onClick={() => setFocusDept(dept)}
                  >
                    {dept}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- GRID & CONTENT SECTION --- */}
        <div className="relative border-t border-border/40">
          {livePulsePosition && (
            <div
              className="absolute left-0 right-0 h-[2px] bg-rose-500 z-[60] pointer-events-none flex items-center shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              style={{ top: `${livePulsePosition}px` }}
            >
              <div className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] absolute left-0 md:left-20 animate-pulse" />
              <div className="absolute left-24 text-[8px] font-black uppercase tracking-tighter text-rose-500 bg-background/80 px-2 py-0.5 rounded-full border border-rose-500/20 backdrop-blur-sm">Live Marker</div>
            </div>
          )}

          {isComfortable ? (
            <div className="animate-in fade-in zoom-in duration-700">
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 border-b border-border/10 mb-4">
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="flex flex-col">
                      <h3 className="text-3xl font-black tracking-tighter text-foreground leading-none">{selectedDayLabel}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mt-1">Operational Timeline</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary shadow-lg shadow-primary/20">
                      <span className="text-2xl font-black tracking-tighter text-primary-foreground">{fmtDayNumber(selectedDate)}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-primary-foreground/70">{selectedMonth}</span>
                    </div>
                    <Badge className="h-8 px-4 rounded-xl bg-muted/40 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-none">
                      {comfortableGrid.total} ACTIVE BLOCKS
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 bg-muted/20 rounded-[2rem] border border-border/40 shadow-inner overflow-x-auto no-scrollbar scroll-smooth">
                    {DAYS.map((day, idx) => {
                      const isActive = day === selectedDay;
                      const date = weekDates[idx];
                      const isToday = isSameDay(date, new Date());
                      
                      return (
                        <Button
                          key={day}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-16 min-w-[85px] flex-col rounded-[1.5rem] transition-all duration-500 relative px-5 gap-1 shadow-sm",
                            isActive 
                              ? "bg-foreground text-background shadow-2xl scale-110 z-10 ring-4 ring-foreground/5" 
                              : "text-muted-foreground/50 hover:text-foreground hover:bg-background/80 hover:shadow-lg"
                          )}
                          onClick={() => setSelectedDay(day)}
                        >
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-none">{day.substring(0, 3)}</span>
                          <span className="text-xl font-black leading-none tracking-tighter">{fmtDayNumber(date)}</span>
                          {isToday && (
                            <span className={cn(
                              "absolute -top-2 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter shadow-md",
                              isActive ? "bg-primary text-white" : "bg-primary/20 text-primary"
                            )}>
                              TODAY
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {comfortableGrid.sortedTimeKeys.length === 0 ? (
                  <div className="py-32 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted/20 border border-border/50 shadow-inner">
                      <Clock className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <p className="text-2xl font-black text-foreground tracking-tight">Zero Density Alert</p>
                    <p className="text-sm text-muted-foreground mt-3 max-w-[240px] mx-auto font-bold uppercase tracking-widest opacity-40">Operational silence detected for this period.</p>
                  </div>
                ) : (
                  <div className="p-8 md:p-12 space-y-12">
                    {comfortableGrid.sortedTimeKeys.map((timeKey) => {
                      const [start, end] = timeKey.split("-");
                      const groups = comfortableGrid.slots.get(timeKey) || [];
                      const isLive = isSelectedDayToday && (() => {
                          const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                          const [s, e] = timeKey.split("-").map(toMinutes);
                          return nowMinutes >= s && nowMinutes <= e;
                        })();

                      return (
                        <div key={timeKey} className="relative group/timeline">
                          <div className="flex items-center gap-6 mb-8">
                            <div className={cn(
                              "flex items-center justify-center px-6 py-3 rounded-[1.5rem] border shadow-2xl transition-all duration-500",
                              isLive 
                                ? "bg-rose-500 border-rose-600 text-white shadow-rose-500/30 scale-110 z-10" 
                                : "bg-background/80 border-border/60 text-muted-foreground group-hover/timeline:border-primary/40 group-hover/timeline:text-foreground"
                            )}>
                              <span className="text-base font-black tabular-nums tracking-tighter">{start} - {end}</span>
                              {isLive && (
                                <div className="ml-3 flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                  <span className="text-[8px] font-black uppercase tracking-widest">Live Now</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-border/40 via-border/10 to-transparent rounded-full" />
                          </div>

                          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
                            {groups.map((group) => {
                              const themeClasses = getTheme(group.departmentName, group.departmentCode, group.codes[0]);
                              const bgColor = getBgColorOnly(themeClasses);
                              const textColor = getTextColorOnly(themeClasses);
                              const isFocused = focusDept === "all" || group.departmentCode === focusDept;
                              const teacherName = group.items[0]?.teacherName || "Unknown Faculty";

                              return (
                                <div key={`${selectedDay}-${timeKey}-${group.departmentCode}`} className="break-inside-avoid mb-6">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "group/card relative h-fit flex flex-col",
                                          comfortableCardClasses,
                                          !isFocused ? "opacity-10 grayscale blur-md pointer-events-none" : "hover:scale-[1.03] hover:z-20 active:scale-[0.98]"
                                        )}
                                      >
                                        <div className={cn("absolute inset-0 transition-all duration-700", bgColor, "opacity-95 group-hover/card:opacity-100")} />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
                                        
                                        <div className={cn("relative z-10 p-6 h-fit flex flex-col", textColor)}>
                                          <div className="flex items-center justify-between gap-3 mb-6">
                                            <div className="flex items-center gap-2.5">
                                              <div className="h-6 w-1.5 rounded-full bg-current opacity-40 group-hover/card:opacity-100 transition-opacity" />
                                              <span className="text-[11px] font-black uppercase tracking-[0.25em] leading-none opacity-90">
                                                {group.departmentName}
                                              </span>
                                            </div>
                                            <div className="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 border border-current/20 text-[9px] font-black uppercase tracking-widest shrink-0 shadow-lg backdrop-blur-md">
                                              {group.departmentCode}
                                            </div>
                                          </div>

                                          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-current/10">
                                            {group.codes.map((code, idx) => (
                                              <Badge key={idx} variant="outline" className="bg-white/10 border-current/20 text-[10px] font-black px-2 py-0 h-5 text-current shadow-sm">
                                                {code}
                                              </Badge>
                                            ))}
                                          </div>

                                          <div className="space-y-5">
                                            {group.items.map((item, idx) => (
                                              <div key={idx} className="space-y-1.5 group/item transition-all hover:translate-x-1">
                                                <div className="flex items-start gap-3">
                                                  <div className="h-2 w-2 rounded-full bg-current opacity-30 mt-1.5 shrink-0 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all" />
                                                  <p className="text-sm font-black leading-tight tracking-tight group-hover/item:underline decoration-2 underline-offset-4 transition-all">
                                                    {item.className}
                                                  </p>
                                                </div>
                                                {item.subjectName && (
                                                  <p className="text-[10px] font-bold opacity-60 ml-5 tracking-tight line-clamp-2 italic">
                                                    {item.subjectName}
                                                  </p>
                                                )}
                                              </div>
                                            ))}
                                          </div>

                                          <div className="mt-8 pt-5 border-t border-current/20 flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-2xl bg-white/10 backdrop-blur-3xl border border-current/20 flex items-center justify-center flex-shrink-0 shadow-xl transition-all group-hover/card:scale-110 group-hover/card:rotate-3">
                                              <span className="text-[11px] font-black tracking-tighter">{getTeacherInitials(teacherName)}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="text-[12px] font-black truncate leading-none mb-1.5 tracking-tighter">
                                                {teacherName}
                                              </p>
                                              <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse opacity-50" />
                                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                                  {group.items.length} SLOTS
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="w-80 rounded-[2rem] border border-border/40 bg-card/90 p-6 shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-[200] animate-in slide-in-from-left-4 duration-500">
                                      <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                          <Badge className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl shadow-lg shadow-primary/20">
                                            {group.departmentCode}
                                          </Badge>
                                          <div className="flex items-center gap-2.5 text-foreground px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-black tabular-nums tracking-tighter">{timeKey.replace("-", " - ")}</span>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-xl font-black tracking-tighter text-foreground leading-none">{group.departmentName}</p>
                                          <p className="text-[11px] font-black text-muted-foreground/60 mt-2 uppercase tracking-[0.2em]">High Intensity Session Group</p>
                                        </div>
                                        <div className="space-y-5 pt-5 border-t border-border/40">
                                          {group.items.map((item, idx) => (
                                            <div key={idx} className="group/detail transition-all hover:translate-x-2">
                                              <div className="flex items-start gap-4">
                                                <Badge variant="outline" className="h-6 px-2 text-[10px] font-black border-primary/30 bg-primary/5 text-primary shrink-0 mt-0.5 shadow-sm">{item.subjectCode}</Badge>
                                                <div className="min-w-0">
                                                  <p className="text-[13px] font-black text-foreground group-hover/detail:text-primary transition-colors leading-tight">{item.className}</p>
                                                  <div className="flex items-center gap-2.5 mt-2 text-muted-foreground">
                                                    <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                                                        <User className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold tracking-tight">{item.teacherName}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex overflow-x-auto no-scrollbar scroll-smooth animate-in fade-in duration-1000">
            <div className="shrink-0 border-r border-border/60 bg-muted/10 relative z-40 w-24">
              <div className="border-b border-border/60 sticky top-0 bg-background/80 backdrop-blur-2xl z-50 flex items-center justify-center h-20 shadow-sm">
                 <div className="flex flex-col items-center">
                    <Clock className="text-primary h-5 w-5 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Time</span>
                 </div>
              </div>
              {timeKeys.map((key) => {
                const [start, end] = key.split("-");
                const isLive = livePulsePosition !== null && (() => {
                   const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                   const [s, e] = key.split("-").map(toMinutes);
                   return nowMinutes >= s && nowMinutes <= e;
                })();

                return (
                  <div key={key} className={cn(
                    "relative flex flex-col justify-center border-b border-border/40 px-4 transition-all duration-500",
                    isLive ? "bg-rose-500/10 shadow-[inset_4px_0_0_0_rgb(244,63,94)]" : "hover:bg-muted/30"
                  )} style={{ height: rowHeights[key] }}>
                    <div className={cn("text-xs font-black tabular-nums tracking-tighter", isLive ? "text-rose-600 scale-110" : "text-foreground")}>{start}</div>
                    <div className="text-[10px] font-bold text-muted-foreground/40 leading-none mt-1 uppercase">{end}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex min-w-0 flex-1 relative bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)]">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex flex-col border-r border-border/40 last:border-r-0 min-w-[160px] group/day transition-all duration-700">
                  <div className="flex flex-col items-center justify-center border-b border-border/60 bg-background/60 sticky top-0 z-30 backdrop-blur-2xl h-20 shadow-sm transition-all group-hover/day:bg-background/90">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">{day.substring(0, 3)}</span>
                    <span className="font-black text-foreground text-xl tracking-tighter">{fmtDayNumber(weekDates[dayIndex])}</span>
                  </div>

                  {timeKeys.map((key) => {
                    const groups = slotsByDay.get(day)?.get(key) || [];
                    const itemsExist = groups.length > 0;

                    return (
                      <div
                        key={`${day}-${key}`}
                        className={cn(
                          "border-b border-border/30 transition-all duration-300 relative p-2",
                          !itemsExist 
                            ? "opacity-20 hover:opacity-100 hover:bg-white/50 dark:hover:bg-black/20" 
                            : "bg-background/5 hover:bg-background/40 hover:z-10 group/cell"
                        )}
                        style={{ height: rowHeights[key] }}
                      >
                        {itemsExist ? (
                          <div
                            className="grid content-start h-full"
                            style={{
                              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                              gap: `6px`,
                              gridAutoRows: `minmax(${capsuleMinHeight}px, auto)`,
                              gridAutoFlow: "dense",
                            }}
                          >
                            {groups.map((group) => {
                              const theme = getTheme(group.departmentName, group.departmentCode, group.codes[0]);
                              const bgColor = getBgColorOnly(theme);
                              const textColor = getTextColorOnly(theme);
                              const isFocused = focusDept === "all" || group.departmentCode === focusDept;
                              const adjustedSpan = getCapsuleColSpan(group.codes.length);

                              return (
                                <Tooltip key={`${day}-${key}-${group.departmentCode}`}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "inline-flex min-h-0 w-full cursor-pointer items-center justify-center rounded-lg font-black tracking-tighter transition-all duration-500 shadow-lg border border-white/10",
                                        capsulePaddingClass,
                                        capsuleTextClass,
                                        bgColor,
                                        textColor,
                                        !isFocused ? "opacity-10 grayscale blur-[3px] pointer-events-none" : "hover:scale-[1.08] hover:shadow-2xl hover:brightness-110 active:scale-95"
                                      )}
                                      style={{ gridColumn: `span ${adjustedSpan} / span ${adjustedSpan}` }}
                                    >
                                      <div className="whitespace-nowrap overflow-hidden text-ellipsis leading-none uppercase">
                                        {group.codes.join(" - ")}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="w-72 rounded-[1.5rem] border border-border/50 bg-card/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl z-[100] animate-in zoom-in duration-300">
                                    <div className="space-y-5">
                                      <div className="flex items-center justify-between">
                                        <Badge className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground px-3 py-1 rounded-xl">
                                          {group.departmentCode}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-foreground font-black px-2.5 py-1 rounded-lg bg-muted/80 border border-border">
                                          <Clock className="h-3.5 w-3.5 text-primary" />
                                          <span className="text-[10px] tabular-nums">{key.replace("-", " - ")}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-base font-black tracking-tighter text-foreground leading-tight">{group.departmentName}</p>
                                        <p className="text-[10px] font-black text-muted-foreground/60 mt-1 uppercase tracking-widest">
                                          {group.items.length} ACTIVE SLOTS
                                        </p>
                                      </div>

                                      <div className="pt-4 border-t border-border/40 space-y-3">
                                        {group.items.slice(0, 4).map((item, idx) => (
                                          <div key={idx} className="flex flex-col group/tip-item transition-all hover:translate-x-1">
                                            <div className="flex items-center gap-2.5">
                                               <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-black border-primary/20 bg-primary/5 text-primary shrink-0">{item.subjectCode}</Badge>
                                               <span className="text-[11px] font-black text-foreground truncate">{item.className}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                               <User className="h-3 w-3 text-primary" />
                                               <span className="text-[10px] font-bold">{item.teacherName}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
});
