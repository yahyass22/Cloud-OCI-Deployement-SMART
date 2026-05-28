import { GitHubBanner, Refine, ErrorComponent, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes, Navigate} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { queryClient } from "@/lib/queryClient";
import { authProvider } from "./providers/auth";
import {BookOpen, Clock, GraduationCap, Home, MessageSquare, Loader2, Navigation} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";

// Lazy load pages
const AuthPage = lazy(() => import("@/pages/auth.tsx"));
const Dashboard = lazy(() => import("@/pages/dashboard.tsx"));
const SubjectsList = lazy(() => import("@/pages/subjects/list.tsx"));
const SubjectsCreate = lazy(() => import("@/pages/subjects/create.tsx"));
const ClassesList = lazy(() => import("@/pages/classes/list.tsx"));
const ClassesCreate = lazy(() => import("@/pages/classes/create.tsx"));
const ClassesShow = lazy(() => import("@/pages/classes/show.tsx"));
const DiscussionsListPage = lazy(() => import("@/pages/discussions/list.tsx"));
const DiscussionsShowPage = lazy(() => import("@/pages/discussions/show.tsx"));
const DiscussionsNewPage = lazy(() => import("@/pages/discussions/new.tsx"));
const SchedulePage = lazy(() => import("@/pages/schedule.tsx"));
const CampusMap = lazy(() => import("@/pages/campus-map.tsx"));
const ComingSoon = lazy(() => import("@/pages/coming-soon.tsx"));

// Page Loading Component
function PageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Custom Logo Component
function Logo() {
  return (
    <img
      src="/logo.png?v=1"
      alt="Classroom Logo"
      className="h-8 w-auto object-contain"
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <ThemeProvider>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            title={<Logo />}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "QVd5OO-hUOFVS-XolpMx",
            }}

              resources={[
                  {
                      name: 'Dashboard' ,
                      list:'/' ,
                      meta : {label: 'Dashboard' , icon: <Home/>}
                  },
                  {
                      name: 'schedule',
                      list: '/schedule',
                      meta: { label: 'Schedule', icon: <Clock /> }
                  },
                  {
                      name: 'discussions',
                      list: '/discussions',
                      create: '/discussions/new',
                      meta: {label: 'Discussions' , icon: <MessageSquare /> }
                  },
                  {
                      name: 'campus-map',
                      list: '/campus-map',
                      meta: { label: 'Campus Map (Soon)', icon: <Navigation /> }
                  },
                  {
                      name: 'subjects',
                      list: '/subjects',
                      create: '/subjects/create',
                      meta: {label: 'Subjects' , icon: <BookOpen /> }
                  },
                  {
                      name: 'classes',
                      list: '/classes',
                      create: '/classes/create',
                      show:'/classes/show/:id',
                      meta: {label: 'Classes' , icon: <GraduationCap /> }
                  }
              ]}
            >
              <Suspense fallback={<PageLoading />}>
                <Routes>
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />
                    <Route element = {
                        <Authenticated fallback={<Navigate to="/login" /> }>
                            <Layout>
                                <Outlet/>
                            </Layout>
                        </Authenticated>
                    }>
                        <Route path = "/" element={<Dashboard/>} />
                        <Route path = "/schedule" element={<SchedulePage/>} />
                        <Route path = "/campus-map" element={<ComingSoon featureName="Campus Map" />} />
                        <Route path = "discussions">
                            <Route index element ={<DiscussionsListPage />} />
                            <Route path = "new" element ={<DiscussionsNewPage/>} />
                            <Route path = ":discussionId" element ={<DiscussionsShowPage/>} />
                        </Route>
                        <Route path = "subjects">
                            <Route index element ={<SubjectsList />} />
                            <Route path = "create" element ={<SubjectsCreate/>} />
                        </Route>
                        <Route path = "classes">
                            <Route index element ={<ClassesList />} />
                            <Route path = "create" element ={<ClassesCreate/>} />
                            <Route path = "show/:id" element ={<ClassesShow/>} />
                            <Route path = ":id/discussions">
                                <Route index element ={<DiscussionsListPage />} />
                                <Route path = "new" element ={<DiscussionsNewPage/>} />
                                <Route path = ":discussionId" element ={<DiscussionsShowPage/>} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                </Routes>
              </Suspense>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
        </ThemeProvider>
      </RefineKbarProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;





