import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import DashboardStats from "../components/dashboard/DashboardStats";
import InventoryChart from "../components/dashboard/InventoryChart";
import AssetStatus from "../components/dashboard/AssetStatus";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen ml-72">
        <Topbar />

        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              Dashboard Overview
            </h2>

            <p className="text-gray-500">
              Monitor assets, inventory, and operations.
            </p>
          </div>

          {/* Stats */}
          <DashboardStats />

          {/* Charts Section */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <InventoryChart />
            </div>

            <div>
              <AssetStatus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}