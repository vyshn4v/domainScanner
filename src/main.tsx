import { createRoot } from "react-dom/client";
import "./index.css";
import DomainReport from "./pages/domain-report/DomainReport.tsx";
import SearchPage from "./pages/search/SearchPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppLayout } from "./AppLayout";
import PortScanReport from "./pages/portscan-report/PortScanReport.tsx";
import ScanRequests from "./pages/scan-requests/ScanRequests.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Profile from "./pages/profile/Profile.tsx";
import RootErrorBoundary from "./pages/error/error.tsx";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "domain-report",
        element: <DomainReport />,
      },
      {
        path: "domain-report/:domain",
        element: <DomainReport />,
      },
      {
        path: "recon/report-lists",
        element: <ScanRequests />,
      },
      {
        path: "recon/report/:domain",
        element: <PortScanReport />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
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
  </ThemeProvider>,
);
