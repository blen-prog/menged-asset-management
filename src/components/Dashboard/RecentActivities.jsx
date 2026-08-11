import {
  Package,
  Wrench,
  UserPlus,
  Truck,
} from "lucide-react";

export default function RecentActivities() {
  const activities = [
    {
      icon: <Package size={16} />,
      color: "bg-blue-100 text-blue-600",
      title: "15 Laptop Chargers added to inventory",
      time: "10 minutes ago",
    },
    {
      icon: <Wrench size={16} />,
      color: "bg-orange-100 text-orange-600",
      title: "Validator V-204 sent for maintenance",
      time: "1 hour ago",
    },
    {
      icon: <UserPlus size={16} />,
      color: "bg-green-100 text-green-600",
      title: "Asset assigned to employee",
      time: "2 hours ago",
    },
    {
      icon: <Truck size={16} />,
      color: "bg-purple-100 text-purple-600",
      title: "New supplier registered",
      time: "Yesterday",
    },
    {
      icon: <Package size={16} />,
      color: "bg-blue-100 text-blue-600",
      title: "50 Receipt Rolls received from supplier",
      time: "Yesterday",
    },
    {
      icon: <UserPlus size={16} />,
      color: "bg-green-100 text-green-600",
      title: "Vehicle assigned to Operations Department",
      time: "2 days ago",
    },
    {
      icon: <Wrench size={16} />,
      color: "bg-orange-100 text-orange-600",
      title: "Maintenance request approved",
      time: "2 days ago",
    },
    {
      icon: <Package size={16} />,
      color: "bg-blue-100 text-blue-600",
      title: "Stationery stock updated",
      time: "3 days ago",
    },
    {
      icon: <Truck size={16} />,
      color: "bg-purple-100 text-purple-600",
      title: "Supplier contract renewed",
      time: "4 days ago",
    },
    {
      icon: <UserPlus size={16} />,
      color: "bg-green-100 text-green-600",
      title: "New employee onboarded",
      time: "5 days ago",
    },
  ];

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