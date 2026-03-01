import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdmissionPage from "./pages/AdmissionPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import ApplicationStatusPage from "./pages/ApplicationStatusPage";
import FeesPage from "./pages/FeesPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import ScholarshipPage from "./pages/ScholarshipPage";
import StaffPage from "./pages/StaffPage";
import StudentPortalPage from "./pages/StudentPortalPage";
import StudentsPage from "./pages/StudentsPage";

// Root layout with navbar/footer
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster richColors position="top-right" />
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Minimal layout for student portal (no main nav, no footer clutter)
function MinimalLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster richColors position="top-right" />
      <Outlet />
    </div>
  );
}

// Admin wrapper
function AdminRoute() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const minimalLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "minimal",
  component: MinimalLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff",
  component: StaffPage,
});

const admissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admission",
  component: AdmissionPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: StudentsPage,
});

const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees",
  component: FeesPage,
});

const scholarshipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scholarship",
  component: ScholarshipPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoute,
});

// Student portal routes use minimal layout (no navbar/footer)
const studentPortalRoute = createRoute({
  getParentRoute: () => minimalLayoutRoute,
  path: "/admission/apply",
  component: StudentPortalPage,
});

const applicationFormRoute = createRoute({
  getParentRoute: () => minimalLayoutRoute,
  path: "/admission/form",
  component: ApplicationFormPage,
});

const applicationStatusRoute = createRoute({
  getParentRoute: () => minimalLayoutRoute,
  path: "/admission/status",
  component: ApplicationStatusPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  staffRoute,
  admissionRoute,
  studentsRoute,
  feesRoute,
  scholarshipRoute,
  galleryRoute,
  adminLoginRoute,
  adminRoute,
  minimalLayoutRoute.addChildren([
    studentPortalRoute,
    applicationFormRoute,
    applicationStatusRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
