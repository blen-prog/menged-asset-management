import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex overflow-hidden">
  <Sidebar />

  <div className="flex-1 bg-gray-100 min-h-screen ml-56 overflow-hidden">
    <Topbar />
    <Outlet />
  </div>
</div>
  );
}