import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex overflow-hidden bg-gray-100 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 bg-gray-100 dark:bg-gray-950 min-h-screen ml-56 overflow-hidden flex flex-col transition-colors duration-200">
        <Topbar />
        <main className="flex-1 p-6 text-gray-900 dark:text-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}