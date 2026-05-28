import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTopTeachers } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TopTeachersMinimal = () => {
  const { data: teachers, isLoading, error } = useTopTeachers();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top Teachers</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Most active faculty by class count</CardDescription>
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
                <TableHead className="text-[10px] uppercase font-bold tracking-wider">Teacher</TableHead>
                <TableHead className="text-[10px] uppercase font-bold tracking-wider">Dept</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold tracking-wider">Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers?.slice(0, 5).map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-muted/50">
                  <TableCell className="text-sm font-medium">{teacher.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{teacher.department}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{teacher.classCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
