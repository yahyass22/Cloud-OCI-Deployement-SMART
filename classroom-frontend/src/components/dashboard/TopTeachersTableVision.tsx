import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopTeachers } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Mail, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TopTeachersTableVision = () => {
  const { data: teachers, isLoading, error } = useTopTeachers();

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
        <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <div>
                <CardTitle className="text-base font-semibold text-white">Top Teachers</CardTitle>
                <CardDescription className="text-xs text-slate-400">Top performers by engagement</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
            <Skeleton className="h-10 w-full" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
            <Skeleton className="h-10 w-full" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-red-400">
            <p>Failed to load data</p>
          </div>
        ) : !teachers || teachers.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-slate-500">
            <p>No teacher data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
                <TableHeader className="border-b border-slate-700/50">
                <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[50px] text-slate-400 font-semibold uppercase text-[10px] tracking-wider">#</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Teacher</TableHead>
                    <TableHead className="text-right text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Stats</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {teachers.slice(0, 5).map((teacher, index) => (
                    <TableRow key={teacher.id} className="hover:bg-white/5 border-b border-slate-700/30 transition-colors group">
                    <TableCell className="font-medium">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                            index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                            index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                            index === 2 ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' :
                            'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                        {index + 1}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{teacher.name}</p>
                            <div className="flex items-center text-[11px] text-slate-500">
                                <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px]">
                                    {teacher.department}
                                </span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                                <BookOpen className="w-3 h-3" />
                                <span>{teacher.classCount} Classes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                                <Users className="w-3 h-3" />
                                <span>{teacher.studentCount} Students</span>
                            </div>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
