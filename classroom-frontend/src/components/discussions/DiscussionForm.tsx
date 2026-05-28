"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, MessageSquare, Info, Sparkles, GraduationCap, Search } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCacheInvalidation } from "@/hooks/useCacheInvalidation";

const discussionTypes = [
  { value: 'general', label: 'General', description: 'Open discussion about anything', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { value: 'question', label: 'Question', description: 'Ask for help or clarification', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'announcement', label: 'Announcement', description: 'Important information', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'resource', label: 'Resource', description: 'Share helpful materials', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

interface Class {
  id: number;
  name: string;
  subject?: {
    name: string;
    code: string;
  };
}

export function DiscussionForm() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { invalidateDiscussions, invalidateDashboard } = useCacheInvalidation();
  const classIdFromParams = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'question' | 'announcement' | 'resource'>('general');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClassState, setSelectedClassState] = useState<Class | null>(null);
  const [preview, setPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClassSelectorOpen, setIsClassSelectorOpen] = useState(false);

  const isGlobalDiscussion = location.pathname.startsWith('/discussions/new');

  // Fetch available classes with server-side search
  const {
    data: classesData,
    isLoading: classesLoading,
    isError: classesError,
    error: classesErrorObj,
    refetch: refetchClasses
  } = useQuery({
    queryKey: ['all-classes', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Class[] }>(`/classes?limit=20&search=${encodeURIComponent(searchQuery)}`);
      return response.data;
    },
    enabled: isGlobalDiscussion,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const classes = classesData || [];

  // Since we're doing server-side search now, filteredClasses is just classes
  const filteredClasses = classes;

  const createDiscussionMutation = useMutation({
    mutationFn: async () => {
      const targetClassId = classIdFromParams || selectedClassId;
      console.log('📝 Creating discussion:', {
        targetClassId,
        classIdFromParams,
        selectedClassId,
        title,
        type
      });

      // Debug: Check if we have credentials
      console.log('🍪 Checking cookies:', document.cookie);

      if (!targetClassId) {
        throw new Error('Please select a class');
      }

      const response = await apiClient.post(`/classes/${targetClassId}/discussions`, {
        title,
        content,
        type,
      });
      console.log('✅ Discussion created:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('🎉 Success:', data);
      const targetClassId = classIdFromParams || selectedClassId;
      toast.success('Discussion created successfully');
      // Invalidate discussion and dashboard caches
      invalidateDiscussions();
      invalidateDashboard();
      // Backend returns { data: discussion }, so access data.data.id
      const discussionId = data.data?.id || data.id;
      navigate(classIdFromParams
        ? `/classes/${classIdFromParams}/discussions/${discussionId}`
        : `/discussions/${discussionId}`
      );
    },
    onError: (error: any) => {
      console.error('❌ Create discussion error:', error);
      const message = error.response?.data?.error || error.message || String(error);
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (isGlobalDiscussion && !selectedClassId) {
      toast.error('Please select a class');
      return;
    }

    createDiscussionMutation.mutate();
  };

  const selectedType = discussionTypes.find(t => t.value === type);

  const getBackPath = () => {
    if (classIdFromParams) {
      return `/classes/${classIdFromParams}/discussions`;
    }
    return '/discussions';
  };

  const selectedClass = selectedClassState;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 shrink-0"
          asChild
        >
          <Link to={getBackPath()} aria-label="Back to discussions">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Create Discussion</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Start a meaningful conversation with your classmates
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Class Selection Card (Global discussions only) */}
          {isGlobalDiscussion && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Select Class</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose any class to post this discussion in
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Popover open={isClassSelectorOpen} onOpenChange={setIsClassSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between h-12",
                        !selectedClassId && "text-muted-foreground"
                      )}
                    >
                      {selectedClassId ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedClass?.name}
                          </span>
                          {selectedClass?.subject && (
                            <Badge variant="secondary" className="text-[10px] font-mono">
                              {selectedClass.subject.code}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        "Choose a class to post in"
                      )}
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command filter={() => true}>
                      <CommandInput 
                        placeholder="Search classes by name..." 
                        className="h-9"
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {classesLoading ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              Loading classes...
                            </div>
                          ) : classesError ? (
                            <div className="py-4 text-center space-y-2">
                              <p className="text-sm text-destructive">
                                {(classesErrorObj as Error)?.message || 'Failed to load classes'}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  refetchClasses();
                                }}
                              >
                                Retry
                              </Button>
                            </div>
                          ) : filteredClasses.length === 0 ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              No classes found. Try a different search term.
                            </div>
                          ) : null}
                        </CommandEmpty>
                        {!classesLoading && filteredClasses.length > 0 && (
                          <CommandGroup>
                            {filteredClasses.map((cls: Class) => (
                              <CommandItem
                                key={cls.id}
                                value={`${cls.name} ${cls.subject?.name || ''} ${cls.subject?.code || ''}`.trim()}
                                onSelect={() => {
                                  setSelectedClassId(String(cls.id));
                                  setSelectedClassState(cls);
                                  setIsClassSelectorOpen(false);
                                  setSearchQuery('');
                                }}                                className="flex items-center justify-between"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{cls.name}</span>
                                    {cls.subject && (
                                      <Badge variant="secondary" className="text-[10px] font-mono ml-1">
                                        {cls.subject.code}
                                      </Badge>
                                    )}
                                  </div>
                                  {cls.subject && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {cls.subject.name}
                                    </p>
                                  )}
                                </div>
                                {selectedClassId === String(cls.id) && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {classes.length > 0 && (
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                      You can post discussions in any class, even if you're not enrolled. This helps you participate in relevant topics!
                    </AlertDescription>
                  </Alert>
                )}
                
                {classes.length === 0 && !classesLoading && (
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                      No classes available yet.{' '}
                      <Link to="/classes" className="font-medium underline underline-offset-2">
                        Browse available classes →
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Discussion Type Card */}
          <Card className="border-primary/35">
            <CardHeader className="pb-3">
              <Label className="text-base font-semibold">Discussion Type</Label>
              <p className="text-xs text-muted-foreground">
                Select the type that best describes your discussion
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {discussionTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-start gap-3 py-2">
                        <Badge variant="secondary" className={`text-xs mt-0.5 ${t.color}`}>
                          {t.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {t.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedType && (
                <Alert className="mt-3 bg-slate-50 dark:bg-slate-900/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">{selectedType.label}:</span>{' '}
                    {selectedType.description}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Title Card */}
          <Card>
            <CardHeader className="pb-3">
              <Label htmlFor="title" className="text-base font-semibold">Title</Label>
              <p className="text-xs text-muted-foreground">
                Write a clear, descriptive title for your discussion
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Question about Assignment 3, Study Group for Midterm..."
                maxLength={500}
                className="h-12 text-base"
              />
              <div className="flex justify-end">
                <p className="text-xs text-muted-foreground">
                  <span className={title.length > 450 ? 'text-amber-600' : ''}>
                    {title.length}
                  </span>
                  {' / 500 characters'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share your thoughts, questions, or resources
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreview(!preview)}
                  className="text-xs h-8"
                >
                  {preview ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preview ? (
                <div className="min-h-[300px] p-6 rounded-lg border bg-card">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || '_Nothing to preview yet. Start writing..._'}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What would you like to discuss? Provide context, details, and any relevant information..."
                  className="min-h-[300px] font-mono text-sm leading-relaxed resize-y"
                />
              )}
              
              {!preview && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    # Heading
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    **bold**
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    *italic*
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    - list
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    [link](url)
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900">
                    `code`
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(getBackPath())}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createDiscussionMutation.isPending || !title.trim() || !content.trim()}
              className="min-w-[140px] h-11 text-sm font-semibold shadow-md shadow-primary/20"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {createDiscussionMutation.isPending ? (
                <>Creating...</>
              ) : (
                <>Create Discussion</>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Guidelines Card */}
      <Card className="bg-muted/30 border-dashed border-2 border-primary/35">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-3 text-sm">Discussion Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Be respectful and constructive in your discussions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Use clear titles and provide context in your content
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Search for existing discussions before creating new ones
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Keep discussions focused on class-related topics
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
