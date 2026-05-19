import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";

export function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
