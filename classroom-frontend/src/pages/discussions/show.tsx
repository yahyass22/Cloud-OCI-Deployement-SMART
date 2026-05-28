import { useParams, Link, useLocation } from "react-router";
import { DiscussionDetail } from "@/components/discussions/DiscussionDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DiscussionsShowPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const discussionId = params.discussionId as string;
  const location = useLocation();

  // Determine if we're in global or class-specific view
  const isGlobalDiscussion = !classId && location.pathname.startsWith('/discussions/');
  
  const getBackPath = () => {
    if (isGlobalDiscussion) {
      return '/discussions';
    }
    return `/classes/${classId}/discussions`;
  };

  const getDiscussionPath = () => {
    if (isGlobalDiscussion) {
      return discussionId;
    }
    return discussionId;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={getBackPath()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isGlobalDiscussion ? 'Back to All Discussions' : 'Back to Class Discussions'}
          </Link>
        </Button>
      </div>

      {/* Discussion Detail */}
      <DiscussionDetail discussionId={getDiscussionPath()} classId={isGlobalDiscussion ? undefined : classId} />
    </div>
  );
};

export default DiscussionsShowPage;
