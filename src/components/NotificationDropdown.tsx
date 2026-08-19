import { ReactNode } from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

interface NotificationItem {
  icon: ReactNode;
  color: string;
  title: string;
  time: string;
}

export default function NotificationDropdown() {
  const notifications: NotificationItem[] = [
    {
      icon: <AlertTriangle size={18} />,
      color: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
      title: "NFC Battery Pack stock critically low (8 units)",
      time: "2h ago",
    },
    {
      icon: <AlertTriangle size={18} />,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      title: "Warranty expiring: Cisco Catalyst 2960 (Sep 10)",
      time: "4h ago",
    },
    {
      icon: <Info size={18} />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
      title: "Maintenance #MNT005 is pending approval",
      time: "5h ago",
    },
    {
      icon: <CheckCircle size={18} />,
      color: "bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400",
      title: "Maintenance #MNT006 completed successfully",
      time: "1d ago",
    },
  ];

  return (
    <div className="absolute right-0 top-14 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Notifications
        </h2>

        <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
            >
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                {item.title}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {item.time}
              </p>
            </div>

            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-1.5 shrink-0" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center">
        <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}