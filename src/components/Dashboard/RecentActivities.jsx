import {
  Package,
  Wrench,
  UserPlus,
  Truck,
} from "lucide-react";

export default function RecentActivities({
  transactions,
  items,
}) {

  


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
      "bg-blue-100 text-blue-600";
    let title = transaction.type;

    switch (transaction.type) {
  case "Purchase":
    icon = <Package size={16} />;
    color =
      "bg-blue-100 text-blue-600";

    title = `${assetName} was added to inventory`;
    break;

  case "Assignment":
    icon = <UserPlus size={16} />;
    color =
      "bg-green-100 text-green-600";

    title = `${assetName} was assigned`;
    break;

  case "Maintenance":
    icon = <Wrench size={16} />;
    color =
      "bg-orange-100 text-orange-600";

    title = `${assetName} was sent for maintenance`;
    break;

  case "Return":
    icon = <Package size={16} />;
    color =
      "bg-cyan-100 text-cyan-600";

    title = `${assetName} was returned to inventory`;
    break;

  case "Disposal":
    icon = <Truck size={16} />;
    color =
      "bg-red-100 text-red-600";

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
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
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
              <p className="text-sm font-medium">
                {activity.title}
              </p>

              <p className="text-xs text-gray-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}