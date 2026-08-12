import {
  Monitor,
  Package,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export default function DashboardStats({ items }) {
  
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
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
  title: "Inventory Items",
  value: inventoryItemsCount,
      change: "Tracked inventory",
      icon: <Package size={16} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
  title: "Low Stock Items",
  value: lowStockItems,
      change: "Require attention",
      icon: <AlertTriangle size={16} />,
      iconBg: "bg-yellow-100",
      iconColor: "text-orange-600",
      changeColor: "text-orange-600",
    },
    {
  title: "Under Maintenance",
  value: underMaintenance,
      change: "Maintenance records",
      icon: <Wrench size={16} />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      changeColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl p-4 border shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                {stat.title}
              </h3>

              <h2 className="text-3xl font-bold mt-1 text-slate-900">
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