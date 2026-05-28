import { WeeklyScheduleDensity } from "@/components/dashboard/v2/WeeklyScheduleDensity";
import { CalendarDays } from "lucide-react";

const SchedulePage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Academic Timeline</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">High-density departmental operational view</p>
        </div>
      </div>

      <WeeklyScheduleDensity />
    </div>
  );
};

export default SchedulePage;
