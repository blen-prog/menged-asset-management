
import DashboardStats from "../components/dashboard/DashboardStats";
import InventoryChart from "../components/dashboard/InventoryChart";
import AssetStatus from "../components/dashboard/AssetStatus";
import RecentActivities from "../components/dashboard/RecentActivities";
import WarrantyExpiring from "../components/dashboard/WarrantyExpiring";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard({ items }) {
  return (
    

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
          <DashboardStats items={items} />

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-2">
              <InventoryChart items={items} />
            </div>

            <div>
              <AssetStatus items={items} />

            </div>
          </div>

          {/* Lower Dashboard Section */}
          <div className="grid grid-cols-3 gap-6 mt-3">
            <div className="col-span-2 space-y-4">
              <RecentActivities />
              <QuickActions />
            </div>

            <div className="space-y-4">
              <WarrantyExpiring />
              <LowStockAlerts items={items} />
            </div>
          </div>
        </div>
      
  );
}