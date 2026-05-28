import { BASE_URL } from "@/constants";

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  totalSubjects: number;
  totalEnrollments: number;
}

export interface EnrollmentTrend {
  month: string;
  count: number;
}

export interface RecentClass {
  id: number;
  name: string;
  status: "active" | "inactive" | "archived";
  capacity: number;
  bannerUrl: string | null;
  subject: {
    name: string;
    code: string;
  };
  teacher: {
    name: string;
    email: string;
  };
  enrolledStudents: number;
}

export interface DepartmentStat {
  name: string;
  code: string;
  teacherCount: number;
  subjectCount: number;
  classCount: number;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  studentEmail: string;
  class: {
    name: string;
  };
  subject: {
    name: string;
    code: string;
  };
  department: string;
  enrolledAt: Date | null;
}

export interface StudentPerformanceResponse {
  data: StudentPerformance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// New interfaces for additional charts
export interface ClassStatusDistribution {
  status: "active" | "inactive" | "archived";
  count: number;
}

export interface DepartmentDistribution {
  name: string;
  code: string;
  classCount: number;
  subjectCount: number;
  teacherCount: number;
}

export interface EnrollmentByDepartment {
  department: string;
  month: string;
  count: number;
}

export interface StudentDepartmentDistribution {
  name: string;
  code: string;
  studentCount: number;
}

export interface ScheduleHeatmapData {
  classId: number;
  className: string;
  subjectName: string;
  subjectCode: string;
  departmentCode: string | null;
  departmentName: string | null;
  teacherName: string;
  teacherImage: string | null;
  day: string;
  startTime: string;
  endTime: string;
}

export interface TopTeacher {
  id: number;
  name: string;
  email: string;
  department: string;
  classCount: number;
  studentCount: number;
}

export interface UserSignupTrend {
  month: string;
  students: number;
  teachers: number;
  total: number;
}

const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    // Normalize BASE_URL - remove trailing /api or / and ensure consistent format
    const normalizedBase = BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const url = `${normalizedBase}/api${endpoint}`;
    
    console.log('📊 Dashboard API request:', url);
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }));
        console.error('❌ Dashboard API error:', response.status, error);
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Dashboard API response:', data);
      return data;
    } catch (error) {
      console.error('❌ Dashboard API fetch error:', error instanceof Error ? error.message : error);
      throw error;
    }
  },
};

export interface AtRiskResource {
  id: string | number;
  name: string;
  inviteCode: string;
  type: "class" | "teacher";
  reason: string;
}

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),
  getEnrollmentTrends: () => apiClient.get<EnrollmentTrend[]>("/dashboard/enrollment-trends"),
  getRecentClasses: () => apiClient.get<RecentClass[]>("/dashboard/recent-classes"),
  getDepartmentStats: () => apiClient.get<DepartmentStat[]>("/dashboard/department-stats"),
  getStudentPerformance: (page: number, limit: number, department?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(department && { department }),
    });
    return apiClient.get<StudentPerformanceResponse>(`/dashboard/student-performance?${params}`);
  },
  // New API calls for additional charts
  getClassStatusDistribution: () => apiClient.get<ClassStatusDistribution[]>("/dashboard/class-status-distribution"),
  getDepartmentDistribution: () => apiClient.get<DepartmentDistribution[]>("/dashboard/department-distribution"),
  getEnrollmentByDepartment: () => apiClient.get<EnrollmentByDepartment[]>("/dashboard/enrollment-by-department"),
  getStudentDepartmentDistribution: () => apiClient.get<StudentDepartmentDistribution[]>("/dashboard/student-department-distribution"),
  getScheduleHeatmap: () => apiClient.get<ScheduleHeatmapData[]>("/dashboard/schedule-heatmap"),
  getTopTeachers: () => apiClient.get<TopTeacher[]>("/dashboard/top-teachers"),
  getUserSignupTrends: () => apiClient.get<UserSignupTrend[]>("/dashboard/user-signup-trends"),
  getAtRiskResources: () => apiClient.get<AtRiskResource[]>("/dashboard/at-risk"),
};
