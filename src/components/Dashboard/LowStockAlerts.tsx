import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "../../types/models";

interface LowStockAlertsProps {
  items: InventoryItem[];
}

export default function LowStockAlerts({ items }: LowStockAlertsProps) {
  const navigate = useNavigate();

  const lowStockItems = items
    .filter(
      (item) => item.quantity > 0 && item.quantity <= item.minimumStock
    )
    .sort((a, b) => a.quantity - b.quantity);

  const outOfStockItems = items.filter((item) => item.quantity === 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Inventory Alerts
      </h2>

      <div className="space-y-3">
        {lowStockItems.map((item, index) => (
          <div
            key={item.id || index}
            className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
          >
            <div className="bg-amber-100 dark:bg-amber-950/50 p-2 rounded-lg">
              <AlertTriangle
                size={16}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </p>

              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {item.quantity} units remaining
              </p>
            </div>
          </div>
        ))}

        {outOfStockItems.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mt-5 mb-2">
              Out of Stock
            </h3>

            {outOfStockItems.map((item, index) => (
              <div
                key={`out-${item.id || index}`}
                className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
              >
                <div className="bg-red-100 dark:bg-red-950/50 p-2 rounded-lg">
                  <AlertTriangle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>

                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                    Out of stock
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/all-items?alert=inventory")}
        className="mt-4 w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        View Inventory
      </button>
    </div>
  );
}