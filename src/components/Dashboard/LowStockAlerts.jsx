import { AlertTriangle } from "lucide-react";

export default function LowStockAlerts() {
  const items = [
    {
      name: "Receipt Rolls",
      quantity: 8,
    },
    {
      name: "NFC Cards",
      quantity: 12,
    },
    {
      name: "Printer Toner",
      quantity: 4,
    },
    {
      name: "AA Batteries",
      quantity: 6,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Low Stock Alerts
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
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
      </div>

      <button className="mt-4 w-full text-sm text-blue-600 font-medium">
        View Inventory
      </button>
    </div>
  );
}