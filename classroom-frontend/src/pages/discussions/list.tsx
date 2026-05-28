import { useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { useSession } from "@/lib/auth-client";
import { AllDiscussionsList, ClassDiscussionsList } from "@/components/discussions/DiscussionsList";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageSquare,
  Plus,
  Clock,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DiscussionsListPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const location = useLocation();
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState('lastActivityAt');
  const [filterType, setFilterType] = useState('all');

  // Check if we're in class-specific discussions or global discussions
  const isClassSpecific = !!classId;
  const isGlobalDiscussions = location.pathname === '/discussions';

  const getNewDiscussionPath = () => {
    if (isClassSpecific) {
      return `/classes/${classId}/discussions/new`;
    }
    return '/discussions/new';
  };

  const getTitle = () => {
    if (isGlobalDiscussions) {
      return {
        title: 'All Discussions',
        subtitle: 'Engage with classmates across all your courses'
      };
    }
    return {
      title: 'Class Discussions',
      subtitle: 'Discuss with your classmates'
    };
  };

  const { title, subtitle } = getTitle();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <Button asChild className="shadow-md shadow-primary/10">
          <Link to={getNewDiscussionPath()}>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Link>
        </Button>
      </div>

      {/* Context Alert for Class-Specific View */}
      {isClassSpecific && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Viewing discussions for this class only.
            <Link to="/discussions" className="font-medium ml-1 underline">
              View all discussions →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters Banner */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-5 rounded-xl border bg-gradient-to-br from-card to-card/50 shadow-sm">
        <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/80 backdrop-blur-sm gap-1 p-1">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="question"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger 
              value="announcement"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              Announcements
            </TabsTrigger>
            <TabsTrigger 
              value="resource"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/25 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              Resources
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 min-w-[200px] w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full bg-background hover:bg-accent/50 transition-colors border-border/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastActivityAt">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Latest Activity
                </div>
              </SelectItem>
              <SelectItem value="latest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="mostActive">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Most Active
                </div>
              </SelectItem>
              <SelectItem value="mostViewed">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Most Viewed
                </div>
              </SelectItem>
              <SelectItem value="unanswered">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Unanswered
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Discussions List */}
      {isGlobalDiscussions ? (
        <AllDiscussionsList filterType={filterType} sortBy={sortBy} />
      ) : (
        <ClassDiscussionsList classId={classId} filterType={filterType} sortBy={sortBy} />
      )}
    </div>
  );
};

export default DiscussionsListPage;
