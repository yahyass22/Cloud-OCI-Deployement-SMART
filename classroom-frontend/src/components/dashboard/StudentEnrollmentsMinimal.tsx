import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStudentPerformance } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StudentEnrollmentsMinimal = () => {
  const { data: enrollmentData, isLoading, error } = useStudentPerformance(1, 5);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Enrollments</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Latest student course registrations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center text-sm text-destructive">Failed to load data</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] uppercase font-bold tracking-wider">Student</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-wider">Class</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollmentData?.data.map((enrollment, index) => (
                <TableRow key={`${enrollment.studentId}-${index}`} className="hover:bg-muted/50">
                  <TableCell className="text-sm font-medium">{enrollment.studentName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{enrollment.class.name}</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
