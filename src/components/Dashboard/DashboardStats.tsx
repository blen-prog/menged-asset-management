import {
  Monitor,
  Package,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import type { InventoryItem } from "../../types/models";

interface DashboardStatsProps {
  items: InventoryItem[];
}

export default function DashboardStats({ items }: DashboardStatsProps) {
  
  const totalAssets = items
  .filter((item) => item.type === "Asset")
  .reduce((sum, item) => sum + item.quantity, 0);

const inventoryItemsCount = items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

const lowStockItems = items.filter(
  (item) =>
    item.quantity > 0 &&
    item.quantity <= item.minimumStock
).length;

const underMaintenance = items.filter(
  (item) => item.assetStatus === "Maintenance"
).length;
  const stats = [
  {
    title: "Total Assets",
    value: totalAssets,
      change: "Active assets",
      icon: <Monitor size={16} />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
  title: "Inventory Items",
  value: inventoryItemsCount,
      change: "Tracked inventory",
      icon: <Package size={16} />,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
  title: "Low Stock Items",
  value: lowStockItems,
      change: "Require attention",
      icon: <AlertTriangle size={16} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-orange-600",
      changeColor: "text-orange-600",
    },
    {
  title: "Under Maintenance",
  value: underMaintenance,
      change: "Maintenance records",
      icon: <Wrench size={16} />,
      iiconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600",
      changeColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </h3>

              <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </h2>
            </div>

            <div
              className={`${stat.iconBg} ${stat.iconColor} p-2 rounded-lg`}
            >
              {stat.icon}
            </div>
          </div>

          <p
            className={`${stat.changeColor} mt-3 text-sm font-medium`}
          >
            ↗ {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}