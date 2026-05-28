"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Eye,
  Pin,
  Clock,
  Plus,
  Megaphone,
  HelpCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Link, useParams } from "react-router";

interface Discussion {
  id: number;
  classId: number;
  authorId: string;
  title: string;
  content: string;
  type: 'general' | 'question' | 'announcement' | 'resource';
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    image: string | null;
  } | null;
  class?: {
    id: number;
    name: string;
  } | null;
}

interface DiscussionsListProps {
  classId?: string;
  filterType?: string;
  sortBy?: string;
}

const typeConfigs: Record<string, { label: string; icon: any; className: string }> = {
  general: {
    label: 'General',
    icon: MessageCircle,
    className: 'bg-muted/50 text-muted-foreground border-muted-foreground/20'
  },
  question: {
    label: 'Question',
    icon: HelpCircle,
    className: 'bg-primary/10 text-primary border-primary/20'
  },
  announcement: {
    label: 'Announcement',
    icon: Megaphone,
    className: 'bg-primary text-primary-foreground border-primary shadow-sm'
  },
  resource: {
    label: 'Resource',
    icon: FileText,
    className: 'bg-muted/80 text-foreground border-border'
  },
};

// Helper function to format timestamp simply
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Main component that handles both global and class-specific discussions
export function DiscussionsList({ classId, filterType = 'all', sortBy = 'lastActivityAt' }: DiscussionsListProps) {
  const params = useParams();
  const resolvedClassId = classId || params.id;

  const { data: discussionsData, isLoading } = useQuery({
    queryKey: resolvedClassId
      ? ['discussions', 'class', resolvedClassId, filterType, sortBy]
      : ['discussions', 'all', filterType, sortBy],
    queryFn: async () => {
      const endpoint = resolvedClassId
        ? `/classes/${resolvedClassId}/discussions?type=${filterType}&sortBy=${sortBy}&limit=50`
        : `/discussions?type=${filterType}&sortBy=${sortBy}&limit=50`;
      const response = await apiClient.get(endpoint);
      return response.data || [];
    },
  });

  const discussions = Array.isArray(discussionsData) ? discussionsData : [];

  const sortedDiscussions = [...discussions].sort((a: Discussion, b: Discussion) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastActivityAt || b.createdAt).getTime() - new Date(a.lastActivityAt || a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse border-border/50">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-3.5">
                <div className="h-11 w-11 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-10 bg-muted rounded" />
                  <div className="h-4 w-10 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-3 rounded-2xl bg-muted/50 mb-3">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold mb-1">No discussions yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">Start the conversation by creating the first discussion!</p>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link to={resolvedClassId ? `/classes/${resolvedClassId}/discussions/new` : '/discussions/new'}>
              <Plus className="h-4 w-4 mr-2" />
              Create Discussion
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-primary/35 shadow-sm overflow-hidden divide-y divide-primary/20">
      {sortedDiscussions.map((discussion: Discussion) => {
        return (
          <div
            key={discussion.id}
            className={`group hover:bg-primary/[0.02] transition-all duration-200 relative border-l-2 border-l-transparent hover:border-l-primary/60 ${
              discussion.isPinned ? 'bg-primary/[0.03] border-l-primary/40' : ''
            }`}
          >
            <Link
              to={resolvedClassId
                ? `/classes/${resolvedClassId}/discussions/${discussion.id}`
                : `/discussions/${discussion.id}`
              }
              className="flex items-center gap-6 p-4 md:px-6 md:py-5"
            >
              {/* Profile Picture */}
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                  <AvatarImage src={discussion.author?.image || undefined} />
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    {discussion.author?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {discussion.author?.role === 'teacher' && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-sm" title="Teacher">
                    <Pin className="h-2.5 w-2.5 text-primary-foreground fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Type Badge */}
                  {(() => {
                    const config = typeConfigs[discussion.type] || typeConfigs.general;
                    const Icon = config.icon;
                    return (
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border transition-all",
                        config.className
                      )}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    );
                  })()}
                  
                  {/* Class Badge */}
                  {!resolvedClassId && discussion.class && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border/50">
                      {discussion.class.name}
                    </span>
                  )}

                  {/* Pinned Indicator */}
                  {discussion.isPinned && (
                    <span className="inline-flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-wider">
                      <Pin className="h-3 w-3 fill-primary" />
                      Pinned
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                  {discussion.title}
                </h3>

                {/* By Line */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                  <span className="font-medium hover:text-foreground transition-colors">
                    {discussion.author?.name || 'Unknown User'}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(discussion.lastActivityAt || discussion.createdAt)}
                  </span>
                </div>
              </div>

              {/* Meta Stats - Desktop only row */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-foreground font-bold text-lg leading-none">
                    {discussion.replyCount}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    Replies
                  </span>
                </div>

                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-foreground/70 font-semibold text-lg leading-none">
                    {discussion.viewCount}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    Views
                  </span>
                </div>
              </div>

              {/* Mobile Stats - Icon only */}
              <div className="flex md:hidden flex-col gap-2 items-end shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs font-bold">
                  <MessageSquare className="h-3 w-3" />
                  {discussion.replyCount}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {discussion.viewCount}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// Export separate components for global and class-specific views
export function AllDiscussionsList({ filterType, sortBy }: { filterType: string; sortBy: string }) {
  return <DiscussionsList filterType={filterType} sortBy={sortBy} />;
}

export function ClassDiscussionsList({ classId, filterType, sortBy }: { classId: string; filterType: string; sortBy: string }) {
  return <DiscussionsList classId={classId} filterType={filterType} sortBy={sortBy} />;
}
