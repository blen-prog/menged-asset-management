import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WarrantyExpiring({
  transactions,
  items,
}) {

  const navigate = useNavigate();
  const maintenanceAlerts =
  transactions
    .filter(
      (transaction) =>
        transaction.type === "Maintenance"
    )
    .slice(0, 5)
    .map((transaction) => ({
      item:
        items.find(
          (item) =>
            item.id ===
            transaction.assetId
        )?.name ||
        transaction.assetId,

      date: transaction.date,
    }));

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
  Maintenance Alerts
</h2>


      <div className="space-y-3">
  {maintenanceAlerts.length > 0 ? (
    maintenanceAlerts.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b pb-3 last:border-0"
          >
            <div className="bg-yellow-100 p-2 rounded-lg">
              <ShieldAlert
                size={16}
                className="text-yellow-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                {item.item}
              </p>

              <p className="text-xs text-orange-500">
  Under Maintenance • {item.date}
</p>
            </div>
                </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">
      No assets currently under maintenance.
    </p>
  )}
</div>

      <button
  onClick={() =>
    navigate("/transactions?filter=Maintenance")
  }
  className="mt-4 w-full text-sm text-blue-600 font-medium"
>
  View All
</button>
    </div>
  );
}
