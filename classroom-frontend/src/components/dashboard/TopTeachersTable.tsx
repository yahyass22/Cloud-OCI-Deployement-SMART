import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopTeachers } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TopTeachersTable = () => {
  const { data: teachers, isLoading, error } = useTopTeachers();

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Top Teachers</CardTitle>
        <CardDescription>Teachers with the most classes and students</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-destructive">
            <p>Failed to load data</p>
          </div>
        ) : !teachers || teachers.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <p>No teacher data available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Classes</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.slice(0, 10).map((teacher, index) => (
                <TableRow key={teacher.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{teacher.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {teacher.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium">
                      {teacher.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.classCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.studentCount}</span>
                    </div>
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
