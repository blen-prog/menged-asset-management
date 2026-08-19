import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem, Transaction } from "../../types/models";

interface MaintenanceAlertsProps {
  transactions: Transaction[];
  items: InventoryItem[];
}

export default function WarrantyExpiring({
  transactions,
  items,
}: MaintenanceAlertsProps) {
  const navigate = useNavigate();

  const maintenanceAlerts = transactions
    .filter((transaction) => transaction.type === "Maintenance")
    .slice(0, 5)
    .map((transaction) => ({
      item:
        items.find((item) => item.id === transaction.assetId)?.name ||
        transaction.assetId,
      date: transaction.date,
    }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Maintenance Alerts
      </h2>

      <div className="space-y-3">
        {maintenanceAlerts.length > 0 ? (
          maintenanceAlerts.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
            >
              <div className="bg-amber-100 dark:bg-amber-950/50 p-2 rounded-lg">
                <ShieldAlert
                  size={16}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.item}
                </p>

                <p className="text-xs text-orange-500 dark:text-orange-400 font-medium">
                  Under Maintenance • {item.date}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No assets currently under maintenance.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate("/transactions?filter=Maintenance")}
        className="mt-4 w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        View All
      </button>
    </div>
  );
}