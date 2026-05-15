import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { AuthGuard } from "./components/AuthGuard";

export function AppLayout() {
  return (
    <AuthGuard>
      <Navbar />
      <Outlet />
    </AuthGuard>
  );
}
