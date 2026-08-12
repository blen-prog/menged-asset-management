import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LowStockAlerts({ items }) {
  const navigate = useNavigate();
  const lowStockItems = items
  .filter(
    (item) =>
      item.quantity > 0 &&
      item.quantity <= item.minimumStock
  )
  .sort((a, b) => a.quantity - b.quantity);

const outOfStockItems = items.filter(
  (item) => item.quantity === 0
);

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Inventory Alerts
      </h2>

      <div className="space-y-3">
        {lowStockItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b pb-3 last:border-0"
          >
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle
                size={16}
                className="text-red-600"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.name}
              </p>

              <p className="text-xs text-red-500">
                {item.quantity} units remaining
              </p>
            </div>
          </div>
        ))}
        {outOfStockItems.length > 0 && (
  <>
    <h3 className="text-sm font-semibold text-red-600 mt-5 mb-2">
      Out of Stock
    </h3>

    {outOfStockItems.map((item, index) => (
      <div
        key={`out-${index}`}
        className="flex items-start gap-3 border-b pb-3 last:border-0"
      >
        <div className="bg-red-100 p-2 rounded-lg">
          <AlertTriangle
            size={16}
            className="text-red-600"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">
            {item.name}
          </p>

          <p className="text-xs text-red-500">
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
  className="mt-4 w-full text-sm text-blue-600 font-medium"
>
  View Inventory
</button>
    </div>
  );
}