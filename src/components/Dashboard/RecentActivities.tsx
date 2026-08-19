import {
  Package,
  Wrench,
  UserPlus,
  Truck,
} from "lucide-react";
import type { InventoryItem, Transaction } from "../../types/models";

interface RecentActivitiesProps {
  transactions: Transaction[];
  items: InventoryItem[];
}

export default function RecentActivities({
  transactions,
  items,
}: RecentActivitiesProps) {

  


  const activities = transactions
  .slice(0, 10)
  .map((transaction) => {

    const assetName =
  items.find(
    (item) =>
      item.id === transaction.assetId
  )?.name || transaction.assetId;

    let icon = <Package size={16} />;
    let color =
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600";
    let title = transaction.type;

    switch (transaction.type) {
  case "Purchase":
    icon = <Package size={16} />;
    color =
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600";

    title = `${assetName} was added to inventory`;
    break;

  case "Assignment":
    icon = <UserPlus size={16} />;
    color =
      "bg-green-100 dark:bg-green-900/30 text-green-600";

    title = `${assetName} was assigned`;
    break;

  case "Maintenance":
    icon = <Wrench size={16} />;
    color =
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600";

    title = `${assetName} was sent for maintenance`;
    break;

  case "Return":
    icon = <Package size={16} />;
    color =
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600";

    title = `${assetName} was returned to inventory`;
    break;

  case "Disposal":
    icon = <Truck size={16} />;
    color =
      "bg-red-100 dark:bg-red-900/30 text-red-600";

    title = `${assetName} was disposed`;
    break;

  default:
    break;
}

    return {
      icon,
      color,
      title,
      time: transaction.date,
    };
  });

  

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Recent Activities
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex gap-3 items-start"
          >
            <div
              className={`p-2 rounded-lg ${activity.color}`}
            >
              {activity.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}