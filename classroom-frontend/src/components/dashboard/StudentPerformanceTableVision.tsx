import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, GraduationCap, Filter } from "lucide-react";
import { useStudentPerformance, useDepartmentStats } from "@/hooks/useDashboard";

export const StudentPerformanceTableVision = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [department, setDepartment] = useState<string | undefined>(undefined);

  const { data: performanceData, isLoading, error } = useStudentPerformance(page, limit, department);
  const { data: departmentStats } = useDepartmentStats();

  const pagination = performanceData?.pagination;

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
      <CardHeader className="pb-3 border-b border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">Student Enrollments</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Detailed enrollment activity and performance metrics
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <Select value={department} onValueChange={(val) => { setDepartment(val === "all" ? undefined : val); setPage(1); }}>
                <SelectTrigger className="w-[160px] h-9 bg-white/5 border-slate-700 text-slate-300 text-xs rounded-lg">
                    <SelectValue placeholder="Departments" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departmentStats?.map((dept) => (
                    <SelectItem key={dept.code} value={dept.name}>
                        {dept.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
              <SelectTrigger className="w-[85px] h-9 bg-white/5 border-slate-700 text-slate-300 text-xs rounded-lg">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                <SelectItem value="5">5 / p</SelectItem>
                <SelectItem value="10">10 / p</SelectItem>
                <SelectItem value="20">20 / p</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-400">
            <p className="text-sm font-medium">Failed to load student data</p>
          </div>
        ) : !performanceData?.data.length ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
            <p className="text-sm font-medium">No enrollment records found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader className="bg-white/5 border-b border-slate-700/50">
                    <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider py-4">Student</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider py-4">Class Details</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider py-4">Department</TableHead>
                    <TableHead className="text-right text-slate-400 font-semibold uppercase text-[10px] tracking-wider py-4">Enrolled Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {performanceData.data.map((student) => (
                    <TableRow key={`${student.studentId}-${student.class.name}`} className="hover:bg-white/5 border-b border-slate-700/30 transition-colors">
                        <TableCell className="py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-200">{student.studentName}</span>
                                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-tighter">{student.studentEmail}</span>
                            </div>
                        </TableCell>
                        <TableCell className="py-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-300 font-medium">{student.class.name}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase tracking-wider">
                                        {student.subject.code}
                                    </span>
                                    <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{student.subject.name}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="py-4">
                            <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700">
                                {student.department}
                            </span>
                        </TableCell>
                        <TableCell className="text-right py-4">
                            <span className="text-xs font-mono text-slate-400">
                                {student.enrolledAt
                                    ? new Date(student.enrolledAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
                                    : "N/A"}
                            </span>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-700/50">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                  {((pagination.page - 1) * pagination.limit + 1).toLocaleString()} - {Math.min(pagination.page * pagination.limit, pagination.total).toLocaleString()} / {pagination.total.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-[11px] font-bold text-slate-300 min-w-[60px] text-center uppercase tracking-widest">
                    P. {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
