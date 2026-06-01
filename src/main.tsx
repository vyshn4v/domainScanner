import { createRoot } from "react-dom/client";
import "./presentation/styles/index.css";
import DomainReport from "./presentation/pages/domain-report/DomainReport.tsx";
import SearchPage from "./presentation/pages/search/SearchPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./presentation/components/layout/ThemeProvider";
import { AppLayout } from "./presentation/layouts/AppLayout";
import PortScanReport from "./presentation/pages/portscan-report/PortScanReport.tsx";
import ScanRequests from "./presentation/pages/scan-requests/ScanRequests.tsx";
import Dashboard from "./presentation/pages/dashboard/Dashboard.tsx";
import Profile from "./presentation/pages/profile/Profile.tsx";
import RootErrorBoundary from "./presentation/pages/error/error.tsx";
import { AuthGuard } from "./presentation/routes/AuthGuard.tsx";
import { AuthProvider } from "./application/auth/AuthProvider.tsx";
import Billing from "./presentation/pages/billing/Billing.tsx";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        element: (
          <AuthGuard>
            <ScanRequests />
          </AuthGuard>
        ),
      },

      {
        path: "scan",
        element: <AuthGuard />,
        children: [
          {
            path: "search",
            element: <SearchPage />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "domain/:domain",
            element: <DomainReport />,
          },
          {
            path: "lists",
            element: <ScanRequests />,
          },
          {
            path: "result/:id",
            element: <PortScanReport />,
          },
        ],
      },
      {
        path: "profile",
        element: (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        ),
      },
      {
        path: "billing",
        element: (
          <AuthGuard>
            <Billing />
          </AuthGuard>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={Router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontFamily: "Space Grotesk, ui-sans-serif, system-ui",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            padding: "12px 16px",
            maxWidth: "400px",
            margin: "0 auto",
          },
          success: {
            style: {
              background: "var(--surface)",
              color: "var(--green)",
              border: "1px solid var(--green)",
              borderRadius: "8px",
              boxShadow:
                "0 10px 25px var(--green-shadow), 0 4px 10px rgba(0, 0, 0, 0.2)",
            },
            iconTheme: {
              primary: "var(--green)",
              secondary: "var(--surface)",
            },
          },
          error: {
            style: {
              background: "var(--surface)",
              color: "var(--red)",
              border: "1px solid var(--red)",
              borderRadius: "8px",
              boxShadow:
                "0 10px 25px var(--red-shadow), 0 4px 10px rgba(0, 0, 0, 0.2)",
            },
            iconTheme: {
              primary: "var(--red)",
              secondary: "var(--surface)",
            },
          },
        }}
      />
    </AuthProvider>
  </ThemeProvider>,
);
