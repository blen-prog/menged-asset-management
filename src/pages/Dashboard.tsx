
import DashboardStats from "../components/Dashboard/DashboardStats";
import InventoryChart from "../components/Dashboard/InventoryChart";
import AssetStatus from "../components/Dashboard/AssetStatus";
import RecentActivities from "../components/Dashboard/RecentActivities";
import MaintenanceAlerts from "../components/Dashboard/MaintenanceAlerts";
import LowStockAlerts from "../components/Dashboard/LowStockAlerts";
import QuickActions from "../components/Dashboard/QuickActions";
import type { InventoryItem, Transaction } from "../types/models";

interface DashboardProps {
  items: InventoryItem[];
  transactions: Transaction[];
}

export default function Dashboard({
  items,
  transactions,
}: DashboardProps) {
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
              <RecentActivities
  transactions={transactions}
  items={items}
/>
              <QuickActions />
            </div>

            <div className="space-y-4">
              <MaintenanceAlerts
  transactions={transactions}
  items={items}
/>
              <LowStockAlerts items={items} />
            </div>
          </div>
        </div>
      
  );
}