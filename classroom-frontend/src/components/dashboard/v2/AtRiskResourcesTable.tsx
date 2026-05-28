import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtRiskResources } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Archive, UserPlus } from "lucide-react";

export function AtRiskResourcesTable() {
  const { data, isLoading, error } = useAtRiskResources();

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  if (error || !data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">At-Risk Resources</CardTitle>
          <CardDescription>Administrative actions required for orphaned data</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
           <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
           <p className="text-sm">No orphaned resources found. System health is optimal.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">At-Risk Resources</CardTitle>
            <CardDescription>Identify orphaned classes and unassigned faculty</CardDescription>
          </div>
          <Badge variant="destructive" className="h-6 font-bold">{data.length} Alerts</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-muted/20 hover:bg-transparent">
              <TableHead className="text-xs uppercase font-bold tracking-wider">Resource</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Type</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Identifyer</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Issue</TableHead>
              <TableHead className="text-right text-xs uppercase font-bold tracking-wider">Quick Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={`${item.type}-${item.id}`} className="border-muted/20">
                <TableCell className="font-medium text-sm">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase ${item.type === "class" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-purple-50 text-purple-600 dark:bg-purple-900/20"}`}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-mono opacity-70">{item.inviteCode}</TableCell>
                <TableCell>
                   <span className="text-xs text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {item.reason}
                   </span>
                </TableCell>
                <TableCell className="text-right">
                  {item.type === "class" ? (
                    <Button variant="outline" size="sm" className="h-8 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                      <Archive className="h-3.5 w-3.5" />
                      Archive Class
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 text-primary hover:bg-primary/10">
                      <UserPlus className="h-3.5 w-3.5" />
                      Assign Subject
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
