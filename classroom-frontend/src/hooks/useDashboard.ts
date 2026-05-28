import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboard";

// Cache timing constants (in milliseconds)
const CACHE_TIMINGS = {
  // Stats change occasionally - 2 minutes stale time
  STATS_STALE_TIME: 2 * 60 * 1000,
  // Trends and historical data - 5 minutes (rarely changes)
  TREND_STALE_TIME: 5 * 60 * 1000,
  // Recent activity - 1 minute (changes frequently)
  RECENT_ACTIVITY_STALE_TIME: 1 * 60 * 1000,
  // Distribution data - 3 minutes
  DISTRIBUTION_STALE_TIME: 3 * 60 * 1000,
  // Schedule data - 5 minutes (changes rarely)
  SCHEDULE_STALE_TIME: 5 * 60 * 1000,
  // At-risk resources - 2 minutes
  AT_RISK_STALE_TIME: 2 * 60 * 1000,
} as const;

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
    staleTime: CACHE_TIMINGS.STATS_STALE_TIME, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every 60 seconds for real-time feel
    refetchIntervalInBackground: false, // Don't refetch when tab is inactive
  });
};

export const useEnrollmentTrends = () => {
  return useQuery({
    queryKey: ["dashboard", "enrollment-trends"],
    queryFn: dashboardApi.getEnrollmentTrends,
    staleTime: CACHE_TIMINGS.TREND_STALE_TIME, // 5 minutes - historical data rarely changes
  });
};

export const useRecentClasses = () => {
  return useQuery({
    queryKey: ["dashboard", "recent-classes"],
    queryFn: dashboardApi.getRecentClasses,
    staleTime: CACHE_TIMINGS.RECENT_ACTIVITY_STALE_TIME, // 1 minute - recent activity changes frequently
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useDepartmentStats = () => {
  return useQuery({
    queryKey: ["dashboard", "department-stats"],
    queryFn: dashboardApi.getDepartmentStats,
    staleTime: CACHE_TIMINGS.DISTRIBUTION_STALE_TIME, // 3 minutes
  });
};

export const useStudentPerformance = (page: number, limit: number, department?: string) => {
  return useQuery({
    queryKey: ["dashboard", "student-performance", page, limit, department],
    queryFn: () => dashboardApi.getStudentPerformance(page, limit, department),
    staleTime: CACHE_TIMINGS.RECENT_ACTIVITY_STALE_TIME, // 1 minute - performance data can change
  });
};

// New hooks for additional charts
export const useClassStatusDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "class-status-distribution"],
    queryFn: dashboardApi.getClassStatusDistribution,
    staleTime: CACHE_TIMINGS.DISTRIBUTION_STALE_TIME, // 3 minutes
  });
};

export const useDepartmentDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "department-distribution"],
    queryFn: dashboardApi.getDepartmentDistribution,
    staleTime: CACHE_TIMINGS.DISTRIBUTION_STALE_TIME, // 3 minutes
  });
};

export const useEnrollmentByDepartment = () => {
  return useQuery({
    queryKey: ["dashboard", "enrollment-by-department"],
    queryFn: dashboardApi.getEnrollmentByDepartment,
    staleTime: CACHE_TIMINGS.TREND_STALE_TIME, // 5 minutes - trend data
  });
};

export const useStudentDepartmentDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "student-department-distribution"],
    queryFn: dashboardApi.getStudentDepartmentDistribution,
    staleTime: CACHE_TIMINGS.DISTRIBUTION_STALE_TIME, // 3 minutes
  });
};

export const useScheduleHeatmap = () => {
  return useQuery({
    queryKey: ["dashboard", "schedule-heatmap"],
    queryFn: dashboardApi.getScheduleHeatmap,
    staleTime: CACHE_TIMINGS.SCHEDULE_STALE_TIME, // 5 minutes - schedules rarely change
  });
};

export const useTopTeachers = () => {
  return useQuery({
    queryKey: ["dashboard", "top-teachers"],
    queryFn: dashboardApi.getTopTeachers,
    staleTime: CACHE_TIMINGS.DISTRIBUTION_STALE_TIME, // 3 minutes
  });
};

export const useUserSignupTrends = () => {
  return useQuery({
    queryKey: ["dashboard", "user-signup-trends"],
    queryFn: dashboardApi.getUserSignupTrends,
    staleTime: CACHE_TIMINGS.TREND_STALE_TIME, // 5 minutes - historical trend data
  });
};

export const useAtRiskResources = () => {
  return useQuery({
    queryKey: ["dashboard", "at-risk"],
    queryFn: dashboardApi.getAtRiskResources,
    staleTime: CACHE_TIMINGS.AT_RISK_STALE_TIME, // 2 minutes - can change when enrollments change
  });
};
