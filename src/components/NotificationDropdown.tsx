import {
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";

export default function NotificationDropdown() {
  const notifications = [
    {
      icon: <AlertTriangle size={18} />,
      color: "bg-red-100 text-red-500",
      title: "NFC Battery Pack stock critically low (8 units)",
      time: "2h ago",
    },
    {
      icon: <AlertTriangle size={18} />,
      color: "bg-yellow-100 text-yellow-500",
      title: "Warranty expiring: Cisco Catalyst 2960 (Sep 10)",
      time: "4h ago",
    },
    {
      icon: <Info size={18} />,
      color: "bg-blue-100 text-blue-500",
      title: "Maintenance #MNT005 is pending approval",
      time: "5h ago",
    },
    {
      icon: <CheckCircle size={18} />,
      color: "bg-green-100 text-green-500",
      title: "Maintenance #MNT006 completed successfully",
      time: "1d ago",
    },
  ];

  return (
    <div className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-xl border z-50">
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Notifications
        </h2>

        <button className="text-blue-600 font-medium hover:text-blue-700">
          Mark all read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 border-b hover:bg-gray-50"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}
            >
              {item.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {item.title}
              </p>

              <p className="text-xstext-gray-400 mt-1">
                {item.time}
              </p>
            </div>

            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t text-center">
        <button className="text-blue-600 font-medium hover:text-blue-700">
          View all notifications
        </button>
      </div>
    </div>
  );
}