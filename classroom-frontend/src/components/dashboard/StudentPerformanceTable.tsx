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
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useStudentPerformance, useDepartmentStats } from "@/hooks/useDashboard";

export const StudentPerformanceTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [department, setDepartment] = useState<string | undefined>(undefined);

  const { data: performanceData, isLoading, error } = useStudentPerformance(page, limit, department);
  const { data: departmentStats } = useDepartmentStats();

  const pagination = performanceData?.pagination;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <div>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>
                Enrollment details and student performance across departments
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={department} onValueChange={(val) => { setDepartment(val === "all" ? undefined : val); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentStats?.map((dept) => (
                  <SelectItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-destructive">
            <p>Failed to load student data</p>
          </div>
        ) : !performanceData?.data.length ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <p>No student enrollment data available</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.data.map((student) => (
                  <TableRow key={`${student.studentId}-${student.class.name}`}>
                    <TableCell className="font-medium">{student.studentName}</TableCell>
                    <TableCell>{student.studentEmail}</TableCell>
                    <TableCell>{student.class.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{student.subject.name}</span>
                        <span className="text-xs text-muted-foreground">{student.subject.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell className="text-right">
                      {student.enrolledAt
                        ? new Date(student.enrolledAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total.toLocaleString()} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
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
