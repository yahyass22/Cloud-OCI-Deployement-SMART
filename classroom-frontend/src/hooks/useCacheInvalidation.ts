import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook providing cache invalidation utilities for the entire app
 * Use this after mutations to ensure fresh data is fetched
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidates all dashboard-related queries
   * Call this after any operation that affects dashboard data
   */
  const invalidateDashboard = async () => {
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  /**
   * Invalidates all classes-related queries
   * Call this after creating/updating/deleting classes
   */
  const invalidateClasses = async () => {
    await queryClient.invalidateQueries({ queryKey: ["classes"] });
  };

  /**
   * Invalidates all subjects-related queries
   * Call this after creating/updating/deleting subjects
   */
  const invalidateSubjects = async () => {
    await queryClient.invalidateQueries({ queryKey: ["subjects"] });
  };

  /**
   * Invalidates all discussions-related queries
   * Call this after creating/updating/deleting discussions or replies
   */
  const invalidateDiscussions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["discussions"] });
  };

  /**
   * Invalidates all users-related queries
   * Call this after creating/updating/deleting users
   */
  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  /**
   * Invalidates all schedule-related queries
   * Call this after updating class schedules
   */
  const invalidateSchedule = async () => {
    await queryClient.invalidateQueries({ queryKey: ["schedule"] });
  };

  /**
   * Invalidates all queries related to a specific class
   * @param classId - The ID of the class to invalidate
   */
  const invalidateClass = async (classId: number | string) => {
    await queryClient.invalidateQueries({ queryKey: ["classes", classId] });
    // Also invalidate discussions for this class
    await queryClient.invalidateQueries({ queryKey: ["discussions", "class", classId] });
  };

  /**
   * Invalidates all queries related to a specific discussion
   * @param discussionId - The ID of the discussion to invalidate
   */
  const invalidateDiscussion = async (discussionId: number | string) => {
    await queryClient.invalidateQueries({ queryKey: ["discussions", discussionId] });
  };

  /**
   * Invalidates all queries related to a specific subject
   * @param subjectId - The ID of the subject to invalidate
   */
  const invalidateSubject = async (subjectId: number | string) => {
    await queryClient.invalidateQueries({ queryKey: ["subjects", subjectId] });
  };

  /**
   * Master invalidation - use sparingly, only for major data changes
   * Invalidates ALL cached data
   */
  const invalidateAll = async () => {
    await queryClient.invalidateQueries();
  };

  /**
   * Invalidates multiple query keys at once
   * @param queryKeys - Array of query keys to invalidate
   */
  const invalidateMultiple = async (queryKeys: Array<string | Array<string | number>>) => {
    await Promise.all(
      queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] }))
    );
  };

  return {
    invalidateDashboard,
    invalidateClasses,
    invalidateSubjects,
    invalidateDiscussions,
    invalidateUsers,
    invalidateSchedule,
    invalidateClass,
    invalidateDiscussion,
    invalidateSubject,
    invalidateAll,
    invalidateMultiple,
  };
};
