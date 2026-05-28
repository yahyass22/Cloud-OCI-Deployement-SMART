"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Eye,
  Pin,
  Lock,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Reply,
  Edit2,
  Trash2,
  Shield,
  Info,
  Megaphone,
  HelpCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useCacheInvalidation } from "@/hooks/useCacheInvalidation";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface DiscussionDetail {
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
  replies: DiscussionReply[];
}

interface DiscussionReply {
  id: number;
  discussionId: number;
  parentId: number | null;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    image: string | null;
  } | null;
  voteCount: number;
  userVote: 'up' | 'down' | null;
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

interface DiscussionDetailProps {
  discussionId: string;
  classId?: string;
}

export function DiscussionDetail({ discussionId, classId }: DiscussionDetailProps) {
  const params = useParams();
  const resolvedClassId = classId || params.id as string;
  const { data: session } = useSession();
  const { invalidateDiscussions, invalidateDashboard, invalidateDiscussion } = useCacheInvalidation();
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);

  const { data: discussion, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn: async () => {
      const endpoint = resolvedClassId
        ? `/classes/${resolvedClassId}/discussions/${discussionId}`
        : `/discussions/${discussionId}`;
      const response = await apiClient.get<{ data: DiscussionDetail }>(endpoint);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds - discussions can change frequently
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: number }) => {
      await apiClient.post(`/discussions/${discussionId}/replies`, {
        content,
        parentId,
      });
    },
    onSuccess: () => {
      invalidateDiscussions();
      invalidateDashboard();
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply posted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post reply');
    },
  });

  const updateReplyMutation = useMutation({
    mutationFn: async ({ replyId, content }: { replyId: number; content: string }) => {
      await apiClient.put(`/discussions/${discussionId}/replies/${replyId}`, {
        content,
      });
    },
    onSuccess: () => {
      invalidateDiscussions();
      setEditingId(null);
      toast.success('Reply updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update reply');
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ replyId, voteType }: { replyId: number; voteType: 'up' | 'down' | null }) => {
      await apiClient.post(`/discussions/${discussionId}/replies/${replyId}/vote`, {
        voteType,
      });
    },
    onSuccess: () => {
      // Keep refresh scoped to the discussion detail to avoid list churn.
      invalidateDiscussion(discussionId);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Action failed');
    },
  });

  const acceptAnswerMutation = useMutation({
    mutationFn: async (replyId: number) => {
      await apiClient.post(`/discussions/${discussionId}/replies/${replyId}/accept`);
    },
    onSuccess: () => {
      invalidateDiscussions();
      invalidateDashboard();
      toast.success('Answer status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Action failed');
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      await apiClient.delete(`/discussions/${discussionId}/replies/${replyId}`);
    },
    onSuccess: () => {
      invalidateDiscussion(discussionId);
      setShowDeleteDialog(null);
      toast.success('Reply deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Action failed');
    },
  });

  const pinMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedClassId) throw new Error("Class ID is required");
      await apiClient.post(`/classes/${resolvedClassId}/discussions/${discussionId}/pin`);
    },
    onSuccess: () => {
      invalidateDiscussion(discussionId);
      toast.success('Discussion pin toggled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update pin');
    }
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedClassId) throw new Error("Class ID is required");
      await apiClient.post(`/classes/${resolvedClassId}/discussions/${discussionId}/lock`);
    },
    onSuccess: () => {
      invalidateDiscussion(discussionId);
      toast.success('Discussion lock toggled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lock');
    }
  });

  const handleReply = () => {
    if (!replyContent.trim()) return;
    createReplyMutation.mutate({ content: replyContent, parentId: replyingTo || undefined });
  };

  const handleVote = (replyId: number, currentVote: 'up' | 'down' | null, newVote: 'up' | 'down') => {
    voteMutation.mutate({ replyId, voteType: currentVote === newVote ? null : newVote });
  };

  const isTeacher = session?.user?.role === 'teacher' || session?.user?.role === 'admin';
  const isGlobalDiscussion = !resolvedClassId || params.id === undefined && !classId;

  if (isLoading) {
    return <div className="max-w-[1200px] mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="h-12 bg-muted rounded-xl w-3/4" />
      <div className="h-64 bg-muted rounded-3xl w-full" />
    </div>;
  }

  if (isError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span>{error instanceof Error ? error.message : 'An error occurred'}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!discussion) return null;

  const rootReplies = discussion.replies?.filter((r: DiscussionReply) => !r.parentId) || [];
  const getRepliesToReply = (parentId: number) => 
    discussion.replies?.filter((r: DiscussionReply) => r.parentId === parentId) || [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Discussion Header: Large Title */}
      <header className="mb-10 border-b border-primary/30 pb-8">
        <div className="flex items-center gap-3 mb-4">
          {(() => {
            const config = typeConfigs[discussion.type] || typeConfigs.general;
            const Icon = config.icon;
            return (
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-all",
                config.className
              )}>
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
            );
          })()}
          {discussion.isPinned && (
            <Badge variant="secondary" className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
              <Pin className="h-3 w-3 mr-1.5 fill-current" />
              Pinned
            </Badge>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-foreground mb-4">
          {discussion.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Post Stream */}
        <div className="lg:col-span-8 space-y-0">
          {/* Main Post (The Original Discussion) */}
          <article className="group relative flex gap-6 pb-12 border-b border-primary/30">
            {/* Left: Avatar */}
            <div className="shrink-0 pt-1">
              <Avatar className="h-14 w-14 ring-4 ring-background shadow-sm border border-primary/20">
                <AvatarImage src={discussion.author?.image || undefined} />
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                  {discussion.author?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Right: Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-foreground text-lg hover:underline cursor-pointer">
                  {discussion.author?.name || 'Unknown'}
                </span>
                {discussion.author?.role === 'teacher' && (
                  <Badge className="bg-primary text-[10px] font-black uppercase tracking-widest h-5 px-2">Staff</Badge>
                )}
                <span className="text-sm text-muted-foreground font-medium">
                  {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border-primary/20">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {discussion.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          {/* New Reply Area (Moved Before Replies) */}
          {!discussion.isLocked ? (
            <div className="mt-8 mb-16">
              <div className="bg-card border border-primary/40 rounded-3xl p-8 shadow-xl shadow-primary/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-full" />
                    {replyingTo ? 'Replying to Thread' : 'Your Contribution'}
                  </h3>
                  {replyingTo && (
                    <Button variant="ghost" size="sm" className="font-bold h-8" onClick={() => setReplyingTo(null)}>Cancel Reply</Button>
                  )}
                </div>
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="What are your thoughts? Use Markdown for formatting..."
                  className="min-h-[180px] text-lg bg-muted/10 border-none focus-visible:ring-2 focus-visible:ring-primary mb-6 p-6 resize-y"
                />
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm bg-muted/30 px-4 py-2 rounded-full">
                    <Info className="h-4 w-4 text-primary" />
                    Markdown, equations, and code are supported
                  </div>
                  <Button 
                    onClick={handleReply} 
                    disabled={!replyContent.trim() || createReplyMutation.isPending}
                    className="px-12 h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    {createReplyMutation.isPending ? 'Posting...' : 'Post Your Reply'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 mb-16 p-12 bg-amber-500/5 border-2 border-amber-500/20 rounded-3xl text-center">
              <Lock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-amber-600">This topic is now closed</h3>
              <p className="text-amber-700/70 text-lg mt-2">New replies are no longer being accepted for this discussion.</p>
            </div>
          )}

          {/* Conversation Stream */}
          <div className="space-y-0">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-10 flex items-center gap-4">
              <span className="shrink-0">Replies</span>
              <div className="h-px w-full bg-primary/20" />
            </h2>

            <div className="space-y-0 divide-y divide-primary/20 border-t border-primary/20">
              {rootReplies.map((reply: DiscussionReply) => (
                <div key={reply.id} className={cn(
                  "py-10 transition-colors group",
                  reply.isAccepted && "bg-emerald-500/[0.02]"
                )}>
                  <div className="flex gap-6 relative">
                    {/* Visual Threading Indicator for Accepted Answers */}
                    {reply.isAccepted && (
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                    )}

                    {/* Left: Avatar & Votes */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                      <Avatar className="h-12 w-12 ring-2 ring-background border border-primary/10">
                        <AvatarImage src={reply.author?.image || undefined} />
                        <AvatarFallback className="text-lg font-bold bg-muted text-muted-foreground">
                          {reply.author?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Compact Votes */}
                      <div className="flex flex-col items-center gap-1 bg-muted/30 rounded-full py-2 px-1 border border-primary/10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 rounded-full", reply.userVote === 'up' ? "text-primary" : "text-muted-foreground hover:text-primary")}
                          onClick={() => handleVote(reply.id, reply.userVote, 'up')}
                        >
                          <ArrowUp className={cn("h-5 w-5", reply.userVote === 'up' && "fill-current")} />
                        </Button>
                        <span className={cn("text-sm font-black tabular-nums", reply.userVote === 'up' ? "text-primary" : "text-foreground")}>
                          {reply.voteCount}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 rounded-full", reply.userVote === 'down' ? "text-destructive" : "text-muted-foreground hover:text-destructive")}
                          onClick={() => handleVote(reply.id, reply.userVote, 'down')}
                        >
                          <ArrowDown className={cn("h-5 w-5", reply.userVote === 'down' && "fill-current")} />
                        </Button>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground">{reply.author?.name || 'Unknown'}</span>
                          {reply.author?.role === 'teacher' && <Badge variant="outline" className="text-[9px] font-black tracking-tighter border-primary/40 text-primary px-1 uppercase">Staff</Badge>}
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                          {reply.isAccepted && (
                            <Badge className="bg-emerald-500 text-[9px] font-black tracking-widest uppercase py-0.5">Solution</Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isTeacher && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => acceptAnswerMutation.mutate(reply.id)}
                              className={cn("h-7 px-2 text-[10px] font-black uppercase tracking-widest", reply.isAccepted ? "text-emerald-600" : "text-muted-foreground hover:text-emerald-600")}
                            >
                              {reply.isAccepted ? 'Unmark Solution' : 'Mark Solution'}
                            </Button>
                          )}
                          {reply.authorId === session?.user?.id && (
                            <Button variant="ghost" size="icon" onClick={() => { setEditingId(reply.id); setEditContent(reply.content); }} className="h-7 w-7 text-muted-foreground hover:text-primary">
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {editingId === reply.id ? (
                        <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-primary/30 shadow-inner">
                          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[120px] bg-background text-base border-none focus-visible:ring-primary shadow-sm" />
                          <div className="flex justify-end gap-3">
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="font-bold">Cancel</Button>
                            <Button size="sm" className="px-6 font-bold" onClick={() => updateReplyMutation.mutate({ replyId: reply.id, content: editContent })} disabled={updateReplyMutation.isPending || !editContent.trim()}>Save Changes</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-[1.7]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {reply.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2">
                        {!discussion.isLocked && (
                          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(reply.id)} className="h-8 px-3 rounded-md text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                            <Reply className="h-3.5 w-3.5 mr-2" />
                            Reply
                          </Button>
                        )}
                        {reply.authorId === session?.user?.id && (
                          <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(reply.id)} className="h-8 px-3 rounded-md text-xs font-black uppercase tracking-widest text-destructive hover:bg-destructive/5">
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>

                      {/* Threaded Nested Replies */}
                      {getRepliesToReply(reply.id).map((nested: DiscussionReply) => (
                        <div key={nested.id} className="mt-8 relative pl-10 border-l-2 border-primary/10 ml-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8 ring-2 ring-background border border-primary/10">
                              <AvatarImage src={nested.author?.image || undefined} />
                              <AvatarFallback className="text-[10px] font-bold">{nested.author?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-xs">{nested.author?.name || 'Unknown'}</span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(nested.createdAt), { addSuffix: true })}</span>
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-xl border border-primary/10">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{nested.content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {rootReplies.length === 0 && (
              <div className="py-20 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-primary/20">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No replies yet</h3>
                <p className="text-muted-foreground">Start the discussion by sharing your thoughts below.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statistics & Info */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
          <Card className="border-primary/40 bg-card overflow-hidden rounded-3xl shadow-lg">
            <CardHeader className="bg-primary/[0.03] border-b border-primary/20 py-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Topic Statistics</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-primary/20 border-b border-primary/20">
                <div className="p-6 text-center">
                  <span className="block text-3xl font-black tabular-nums">{discussion.replyCount}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 block">Replies</span>
                </div>
                <div className="p-6 text-center">
                  <span className="block text-3xl font-black tabular-nums text-foreground/70">{discussion.viewCount}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 block">Views</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Created</span>
                  <span className="font-black text-foreground">{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
                {discussion.lastActivityAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-muted-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Last Activity</span>
                    <span className="font-black text-primary">{formatDistanceToNow(new Date(discussion.lastActivityAt), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {isTeacher && !isGlobalDiscussion && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary px-4">Administrative</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 justify-start px-6 rounded-2xl font-black transition-all border-primary/30",
                    discussion.isPinned ? "bg-primary text-primary-foreground" : "hover:bg-primary/5 hover:border-primary"
                  )}
                  onClick={() => pinMutation.mutate()}
                >
                  <Pin className={cn("h-5 w-5 mr-4", discussion.isPinned && "fill-current")} />
                  {discussion.isPinned ? 'Unpin Topic' : 'Pin Topic'}
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 justify-start px-6 rounded-2xl font-black transition-all border-amber-500/30",
                    discussion.isLocked ? "bg-amber-500 text-white" : "hover:bg-amber-500/5 hover:border-amber-500"
                  )}
                  onClick={() => lockMutation.mutate()}
                >
                  <Lock className={cn("h-5 w-5 mr-4", discussion.isLocked && "fill-current")} />
                  {discussion.isLocked ? 'Unlock Topic' : 'Close Topic'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reply</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => showDeleteDialog && deleteReplyMutation.mutate(showDeleteDialog)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
