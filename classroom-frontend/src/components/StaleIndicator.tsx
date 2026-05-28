import { Clock, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface StaleIndicatorProps {
  /** Timestamp when data was last fetched */
  lastUpdatedAt?: Date | null;
  /** Whether data is currently stale */
  isStale?: boolean;
  /** Whether data is currently fetching */
  isFetching?: boolean;
  /** Callback to trigger refetch */
  onRefresh?: () => void;
  /** Custom class name */
  className?: string;
  /** Show compact version */
  compact?: boolean;
}

/**
 * StaleIndicator component shows when data was last updated and allows manual refresh
 * Displays:
 * - Green dot + "Just now" if data is fresh (< 30 seconds)
 * - Yellow dot + "X min ago" if data is stale but recent
 * - Orange dot + "X hours ago" if data is very stale
 */
export const StaleIndicator = ({
  lastUpdatedAt,
  isStale = false,
  isFetching = false,
  onRefresh,
  className,
  compact = false,
}: StaleIndicatorProps) => {
  // Calculate time since last update
  const getTimeAgo = () => {
    if (!lastUpdatedAt) return "Never";
    
    const now = new Date();
    const lastUpdate = new Date(lastUpdatedAt);
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDistanceToNow(lastUpdate, { addSuffix: true });
  };

  // Determine status color based on staleness and age
  const getStatusColor = () => {
    if (isFetching) return "bg-blue-500 animate-pulse";
    if (!isStale) return "bg-emerald-500";
    
    const timeAgo = getTimeAgo();
    if (timeAgo === "Just now" || timeAgo.endsWith("m ago")) return "bg-amber-500";
    return "bg-orange-500";
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
        {!isFetching && (
          <span className="text-[10px] font-medium text-muted-foreground">
            {getTimeAgo()}
          </span>
        )}
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-muted/50"
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCcw className={cn("h-3 w-3", isFetching && "animate-spin")} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50", className)}>
      <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
      <Clock className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">
        {isFetching ? "Updating..." : `Updated ${getTimeAgo()}`}
      </span>
      {isStale && onRefresh && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RefreshCcw className={cn("h-3 w-3", isFetching && "animate-spin")} />
        </Button>
      )}
    </div>
  );
};

/**
 * Hook to get stale state for a query
 * Returns lastUpdatedAt, isStale, and refetch function
 */
export const useStaleState = (queryResult: {
  dataUpdatedAt?: number;
  isStale?: boolean;
  isFetching?: boolean;
  refetch?: () => void;
}) => {
  const { dataUpdatedAt = 0, isStale = false, isFetching = false, refetch } = queryResult;
  
  return {
    lastUpdatedAt: dataUpdatedAt > 0 ? new Date(dataUpdatedAt) : null,
    isStale,
    isFetching,
    refetch: refetch ? () => refetch() : undefined,
  };
};
