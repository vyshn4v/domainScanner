import { Outlet } from "react-router";
import { Navbar } from "../components/layout/Navbar";

export function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
